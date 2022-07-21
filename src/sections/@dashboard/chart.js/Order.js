import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import BarChart from '../../../components/BarChart';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import LineChart from 'src/components/LineChart';
// ----------------------------------------------------------------------

const colors = [
  'rgba(198,185,192,1)',
  'rgba(192,219,90,1)',
  'rgba(93,77,203,1)',
  'rgba(65,51,46,1)',
  'rgba(98,161,157,1)',
  'rgba(85,33,71,1)',
  'rgba(36,123,233,1)'
]

export default function Order() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [user, setUser] = useState();

  // by terminal
  const [display, setDisPlay] = useState(true);
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

  const fetchOrderStatisticByTerminal = async () => {
    return await callApiHttp({
      url: `/statistic/orders`,
      method: 'GET',
    });
  };

  const fetchOrderStatisticBySeller = async () => {
    return await callApiHttp({
      url: `/statistic/orders-seller`,
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
      setUser(data);
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
    Promise.all([fetchOrderStatisticByTerminal(), fetchOrderStatisticBySeller()])
      .then((res) => {
        {
          // terminal
          const { date_of_orders, terminal_to_list_total_order } = res[0]?.data?.data;
          setNameChart('Theo gian hàng');
          let index = 0
          setChartData({
            labels: date_of_orders.reverse(),
            datasets: terminal_to_list_total_order.map((item) => {
              return {
                label: item?.name,
                fill: false,
                lineTension: 0.5,
                backgroundColor: colors[index++],
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: item?.total_orders.reverse(),
              };
            }),
          });
        }
        {
          // seller
          const { date_of_orders, terminal_to_list_total_order } = res[1]?.data?.data;
          setNameChartBySeller('Theo ngưới bán');
          let index = 0
          setChartDataBySeller({
            labels: date_of_orders.reverse(),
            datasets: terminal_to_list_total_order.map((item) => {
              return {
                label: item?.name,
                fill: false,
                lineTension: 0.5,
                backgroundColor: colors[index++],
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: item?.total_orders.reverse(),
              };
            }),
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
    getCurrentUser();
  }, []);

  return (
    <Grid container spacing={3}>
      <Stack>
        <Typography variant="h5" component="h4" ml={3} width={300}>
          Thống kê số lượng đơn hàng
        </Typography>
      </Stack>
      <LineChart chartData={chartData} nameChart={nameChart} legendDisplay={display} />
      <Stack></Stack>
      { user?.role === 'ADMIN' && <LineChart chartData={chartDataBySeller} nameChart={nameChartBySeller} legendDisplay={displayBySeller} />}
    </Grid>
  );
}
