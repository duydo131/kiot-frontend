import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Grid, Stack, Typography } from '@mui/material';

import useUser from '../../../hooks/useUser';
import BarChart from '../../../components/BarChart';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import * as _ from '../../../constants/business';
import Combobox from 'src/components/Combobox';
// ----------------------------------------------------------------------

const getParams = (type) => {
  return {
    'time_range': type
  }
}

export default function RevenueByTime() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const { account } = useUser();

  // by terminal
  const [nameChart, setNameChart] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [nameChartPlatform, setNameChartPlatform] = useState('');
  const [chartDataPlatform, setChartDataPlatform] = useState({
    labels: [],
    datasets: [],
  });

  const [type, setType] = useState(7);

  const fetchRevenueByTime = async (params) => {
    try {
      const res = await callApiHttp({
        url: '/statistic/revenue-user',
        method: 'GET',
        params: {...params},
      });
      const { dates, revenues } = res?.data?.data;

      setNameChart(`Doanh thu gian hàng`);

      setChartData({
        labels: dates.reverse(),
        datasets: [
          {
            label: 'Doanh thu gian hàng',
            data: revenues.reverse(),
            backgroundColor: ['#ffbb11'],
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

  const fetchRevenueByTimeOfPlatform = async (params) => {
    try {
      const res = await callApiHttp({
        url: '/statistic/revenue-platform',
        method: 'GET',
        params: {...params},
      });
      const { dates, revenues } = res?.data?.data;

      setNameChartPlatform(`Doanh thu sàn`);

      setChartDataPlatform({
        labels: dates.reverse(),
        datasets: [
          {
            label: 'Doanh thu sàn',
            data: revenues.reverse(),
            backgroundColor: ['#081b3d'],
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
    const params = getParams(type)
    fetchRevenueByTime(params);
    fetchRevenueByTimeOfPlatform(params);
  }, [type]);

  return (
    <Grid container spacing={3}>
      {account?.role === 'ADMIN' && (
        <>
          <Stack direction="row" alignItems="center">
            <Typography variant="h5" component="h4" ml={3} width={400}>
              Thống kê doanh thu theo thời gian
            </Typography>
            <Combobox label={'Khoảng thời gian'} items={_.ranges} value={type} setValue={setType} />
          </Stack>
          <BarChart chartData={chartData} nameChart={nameChart} legendDisplay={true} width={'90%'}/>
          <Stack></Stack>
          <BarChart chartData={chartDataPlatform} nameChart={nameChartPlatform} legendDisplay={true} width={'90%'}/>
        </>
      )}
    </Grid>
  );
}
