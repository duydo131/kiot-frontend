import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import useUser from '../../../hooks/useUser';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import LineChart from 'src/components/LineChart';
import * as _ from '../../../constants/business';
import Combobox from 'src/components/Combobox';
// ----------------------------------------------------------------------

const colors = [
  'rgba(198,185,192,1)',
  'rgba(192,219,90,1)',
  'rgba(93,77,203,1)',
  'rgba(65,51,46,1)',
  'rgba(98,161,157,1)',
  'rgba(85,33,71,1)',
  'rgba(36,123,233,1)',
];

const getParams = (type) => {
  return {
    'time_range': type
  }
}

export default function Order() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const { account } = useUser();

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

  const [type, setType] = useState(7);

  const fetchOrderStatisticByTerminal = async (params) => {
    return await callApiHttp({
      url: `/statistic/orders`,
      method: 'GET',
      params: {...params}
    });
  };

  const fetchOrderStatisticBySeller = async (params) => {
    return await callApiHttp({
      url: `/statistic/orders-seller`,
      method: 'GET',
      params: {...params}
    });
  };

  useEffect(() => {
    const params = getParams(type)
    Promise.all([fetchOrderStatisticByTerminal(params), fetchOrderStatisticBySeller(params)])
      .then((res) => {
        {
          // terminal
          const { date_of_orders, terminal_to_list_total_order } = res[0]?.data?.data;
          setNameChart('Theo gian hàng');
          let index = 0;
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
          let index = 0;
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
  }, [type]);

  return (
    <Grid container spacing={3}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h5" component="h4" ml={3} width={300}>
          Thống kê số lượng đơn hàng
        </Typography>
        <Combobox label={'Khoảng thời gian'} items={_.ranges} value={type} setValue={setType} />
      </Stack>
      <LineChart chartData={chartData} nameChart={nameChart} legendDisplay={display} />
      <Stack></Stack>
      {account?.role === 'ADMIN' && (
        <LineChart chartData={chartDataBySeller} nameChart={nameChartBySeller} legendDisplay={displayBySeller} />
      )}
    </Grid>
  );
}
