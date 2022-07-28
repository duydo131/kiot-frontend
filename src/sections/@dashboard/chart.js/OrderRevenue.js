import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import useUser from '../../../hooks/useUser';
import callApiHttp from '../../../utils/api';
import { actEnableToast } from '../../../actions/index';
import DoughnutChart from 'src/components/DoughnutChart';
import Combobox from '../../../components/Combobox'
import * as _ from '../../../constants/business';
// utils
import { parseMonthToInt, getAnyMonthsAgo } from '../../../utils/formatNumber';
import { fDateTimeDay } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const chartColors = [
  '#336699',
  '#99CCFF',
  '#999933',
  '#666699',
  '#CC9933',
  '#006666',
  '#3399FF',
  '#993300',
  '#CCCC99',
  '#666666',
  '#FFCC66',
  '#6699CC',
  '#663366',
  '#9999CC',
  '#CCCCCC',
  '#669999',
  '#CCCC66',
  '#CC6600',
  '#9999FF',
  '#0066CC',
  '#99CCCC',
  '#999999',
  '#FFCC00',
  '#009999',
  '#99CC33',
  '#FF9900',
  '#999966',
  '#66CCCC',
  '#339966',
  '#CCCC33',
  '#003f5c',
  '#665191',
  '#a05195',
  '#d45087',
  '#2f4b7c',
  '#f95d6a',
  '#ff7c43',
  '#ffa600',
  '#EF6F6C',
  '#465775',
  '#56E39F',
  '#59C9A5',
  '#5B6C5D',
  '#0A2342',
  '#2CA58D',
  '#84BC9C',
  '#CBA328',
  '#F46197',
  '#DBCFB0',
  '#545775',
];

const getParams = (value) => {
  if (value === 'all' || value === '') {
    return {
      type: 'all',
      value: 0,
    };
  }
  return {
    type: 'month',
    value: parseInt(value),
  };
};

export default function OrderRevenue() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const { account } = useUser();

  // by terminal
  const [nameChart, setNameChart] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // by revenue
  const [nameChartRevenue, setNameChartRevenue] = useState('');
  const [chartDataRevenue, setChartDataRevenue] = useState({
    labels: [],
    datasets: [],
  });

  // by order
  const [nameChartOrder, setNameChartOrder] = useState('');
  const [chartDataOrder, setChartDataOrder] = useState({
    labels: [],
    datasets: [],
  });

  const [month, setMonth] = useState('1');

  const fetchUsers = async () => {
    const params = getParams(month)
    try {
      const res = await callApiHttp({
        url: '/users',
        method: 'GET',
        params: {
          role: 'USER',
          ...params,
        },
      });
      const { results: users } = res?.data?.data;

      // setNameChart('5 người mua hàng nhiều nhất');
      setNameChart('Doanh thu gian hàng');
      const fiveUsers = users.sort((u1, u2) => u2.total_revenue - u1.total_revenue).slice(0, 5);
      const labels = fiveUsers.map((item) => item.name)
      setChartData({
        maintainAspectRatio: false,
        responsive: false,
        labels: labels,
        datasets: [
          {
            data: fiveUsers.map((user) => user.total_money),
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
          },
        ],
      });

      setNameChartRevenue('Doanh thu sàn');
      setChartDataRevenue({
        maintainAspectRatio: false,
        responsive: false,
        labels: labels,
        datasets: [
          {
            data: fiveUsers.map((user) => user.total_revenue),
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
          },
        ],
      });

      setNameChartOrder('Tổng số đơn hàng');
      setChartDataOrder({
        maintainAspectRatio: false,
        responsive: false,
        labels: labels,
        datasets: [
          {
            data: fiveUsers.map((user) => user.total_order),
            backgroundColor: chartColors,
            hoverBackgroundColor: chartColors,
          },
        ],
      });
    } catch (e) {
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [month]);

  return (
    <Grid container spacing={3}>
      {account?.role === 'ADMIN' && (
        <>
          <Stack direction="row" alignItems="center">
            <Typography variant="h5" component="h4" ml={3} width={600}>
              Thống kê theo nguời dùng (5 người nhiểu nhất)
            </Typography>
            <Combobox label={'Thời gian'} items={_.months} value={month} setValue={setMonth} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3} mt={3}>
            <DoughnutChart chartData={chartData} nameChart={nameChart} legendDisplay={false} />
            <DoughnutChart chartData={chartDataRevenue} nameChart={nameChartRevenue} legendDisplay={true} />
            <DoughnutChart chartData={chartDataOrder} nameChart={nameChartOrder} legendDisplay={false} />
          </Stack>
         
        </>
      )}
    </Grid>
  );
}
