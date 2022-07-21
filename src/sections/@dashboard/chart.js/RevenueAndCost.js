import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import BarChart from '../../../components/BarChart';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
// ----------------------------------------------------------------------

function numberWithCommas(x) {
  if (typeof x === 'undefined') return x;
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

export default function RevenueAndCost() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [user, setUser] = useState()

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

  const fetchRevenueAndCostByTerminal = async () => {
    return await callApiHttp({
      url: `/statistic/income-terminal`,
      method: 'GET',
    });
  };

  const fetchRevenueAndCostBySeller = async () => {
    return await callApiHttp({
      url: `/statistic/income-seller`,
      method: 'GET',
    });
  };

  const getCurrentUser = async () => {
    try {
      const res = await callApiHttp({
        url: '/users/me',
        method: 'GET',
      });
      const { data } = res?.data;
      setUser(data)
      if(data?.role !== 'ADMIN') setDisPlay(true)
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    }
  };

  useEffect(() => {
    Promise.all([fetchRevenueAndCostByTerminal(), fetchRevenueAndCostBySeller()])
      .then((res) => {
        {
          // terminal
          const { data } = res[0]?.data;
          setNameChart('Theo gian hàng (5 gian hàng doanh thu lớn nhất)');
          const fiveData = data.filter(item => item.revenue > 0 || item.cost > 0).slice(0, 5);
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
          const fiveData = data.filter(item => item.revenue > 0 || item.cost > 0).slice(0, 5);
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
  }, []);

  useEffect(() => {
    getCurrentUser()
  }, [])

  return (
    <Grid container spacing={3}>
      <Stack>
        <Typography variant="h5" component="h4" ml={3} width={300}>
          Thống kê doanh thu và chi phí
        </Typography>
      </Stack>
      <Stack spacing={2} alignItems="center">
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
      { user?.role === 'ADMIN' && <BarChart chartData={chartDataBySeller} nameChart={nameChartBySeller} legendDisplay={displayBySeller} />}
    </Grid>
  );
}
