import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import useUser from '../../../hooks/useUser';
import BarChart from '../../../components/BarChart';
import Combobox from '../../../components/Combobox'
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import * as _ from '../../../constants/business';
// utils
import { parseMonthToInt, getAnyMonthsAgo } from '../../../utils/formatNumber';
import { fDateTimeDay } from '../../../utils/formatTime';



// ----------------------------------------------------------------------

function numberWithCommas(x) {
  if (typeof x === 'undefined') return x;
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

const getParams= (month) => {
  const monthInt = parseMonthToInt(month)
  if(monthInt <= 0) return {}
  const d = getAnyMonthsAgo(monthInt)
  const started_at_from = fDateTimeDay(d)
  return {
    'started_at_from': started_at_from
  }
}

export default function RevenueAndCost() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const { account } = useUser();

  // by terminal
  const [display, setDisPlay] = useState(false);
  const [nameChart, setNameChart] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // by seller
  const [displayBySeller, setDisPlayBySeller] = useState(true);
  const [nameChartBySeller, setNameChartBySeller] = useState('');
  const [chartDataBySeller, setChartDataBySeller] = useState({
    labels: [],
    datasets: [],
  });

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [month, setMonth] = useState('1');

  const fetchRevenueAndCostByTerminal = async (params) => {
    return await callApiHttp({
      url: `/statistic/income-terminal`,
      method: 'GET',
      params: {...params},
    });
  };

  const fetchRevenueAndCostBySeller = async (params) => {
    return await callApiHttp({
      url: `/statistic/income-seller`,
      method: 'GET',
      params: {...params},
    });
  };

  useEffect(() => {
    const params = getParams(month)
    Promise.all([fetchRevenueAndCostByTerminal(params), fetchRevenueAndCostBySeller(params)])
      .then((res) => {
        {
          // terminal
          const { data } = res[0]?.data;
          setNameChart('Theo gian hàng (5 gian hàng doanh thu lớn nhất)');
          const fiveData = data.filter((item) => item.revenue > 0 || item.cost > 0).slice(0, 5);
          setChartData({
            labels: fiveData.map((category) => category.name),
            datasets: [
              {
                label: 'Doanh Thu',
                data: fiveData.map((category) => category.revenue),
                backgroundColor: ['#ffbb11'],
              },
              {
                label: 'Chi Phí',
                data: fiveData.map((category) => category.cost),
                backgroundColor: ['#081b3d'],
              },
              {
                label: 'Lợi Nhuận',
                data: fiveData.map((category) => category.revenue - category.cost),
                backgroundColor: ['#ff1111'],
              },
            ],
          });
          const revenue = data.reduce((a, b) => a + b['revenue'], 0);
          const cost = data.reduce((a, b) => a + b['cost'], 0);
          setTotalRevenue(revenue);
          setTotalCost(cost);
          setTotalProfit(revenue - cost);
        }
        {
          // seller
          const { data } = res[1]?.data;
          console.log(data);
          setNameChartBySeller('Theo người bán (5 người bán hàng doanh thu lớn nhất)');
          const fiveData = data.filter((item) => item.revenue > 0 || item.cost > 0).slice(0, 5);
          setChartDataBySeller({
            labels: fiveData.map((category) => category.name),
            datasets: [
              {
                label: 'Doanh Thu',
                data: fiveData.map((category) => category.revenue),
                backgroundColor: ['#ffbb11'],
              },
              {
                label: 'Chi Phí',
                data: fiveData.map((category) => category.cost),
                backgroundColor: ['#081b3d'],
              },
              {
                label: 'Lợi Nhuận',
                data: fiveData.map((category) => category.revenue - category.cost),
                backgroundColor: ['#ff1111'],
              },
            ],
          });
        }
      })
      .catch((e) => {
        console.log('e', e);
        let err = e?.response?.data?.data;
        let errText = 'Lỗi hệ thống';
        if (typeof err === 'object') {
          errText = '';
          for (let key in err) {
            errText += `${key} : ${err[key]} \n`;
          }
        }
        toast(errText);
      });
  }, [month]);

  useEffect(() => {
    if (account?.role === 'MANAGER') setDisPlay(true);
  }, [account]);

  return (
    <Grid container spacing={3}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h5" component="h4" ml={3} width={300}>
          Thống kê doanh thu và chi phí
        </Typography>
        <Combobox label={'Thời gian'} items={_.months} value={month} setValue={setMonth} />
      </Stack>
      <Stack spacing={2} alignItems="center" mt={4}>
        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tổng doanh thu
          </Typography>
          <Typography ml={3} width={500}>
            {numberWithCommas(totalRevenue || 0)} đồng
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tổng chi phí
          </Typography>
          <Typography ml={3} width={500}>
            {numberWithCommas(totalCost || 0)} đồng
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tổng lợi nhuận
          </Typography>
          <Typography ml={3} width={500}>
            {numberWithCommas(totalProfit || 0)} đồng
          </Typography>
        </Stack>
      </Stack>
      <BarChart chartData={chartData} nameChart={nameChart} legendDisplay={display} />
      {account?.role === 'ADMIN' && (
        <BarChart chartData={chartDataBySeller} nameChart={nameChartBySeller} legendDisplay={displayBySeller} />
      )}
    </Grid>
  );
}
