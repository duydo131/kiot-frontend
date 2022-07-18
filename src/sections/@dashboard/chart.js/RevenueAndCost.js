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

  const [display, setDisPlay] = useState(true);
  const [nameChart, setNameChart] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const fetchRevenueAndCost = async () => {
    return await callApiHttp({
      url: `/statistic/income`,
      method: 'GET',
    });
  };

  useEffect(() => {
    Promise.all([fetchRevenueAndCost()])
      .then((res) => {
        const { data } = res[0]?.data;
        console.log(data);
        setNameChart('Thống kê doanh số và chi phí (5 gian hàng doanh thu lớn nhất)');
        const fiveData = data.slice(0, 5);
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
        const revenue = data.reduce((a, b) => a + b['revenue'], 0)
        const cost = data.reduce((a, b) => a + b['cost'], 0)
        setTotalRevenue(revenue);
        setTotalCost(cost);
        setTotalProfit(revenue - cost);
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
            Tổng doanh thu
          </Typography>
          <Typography  ml={3} width={500}>
            {numberWithCommas(totalProfit || 0)} đồng
          </Typography>
        </Stack>
      </Stack>
      <BarChart chartData={chartData} nameChart={nameChart} legendDisplay={display} />
    </Grid>
  );
}
