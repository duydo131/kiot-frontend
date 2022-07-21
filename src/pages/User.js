import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Container, Stack, Typography, Breadcrumbs } from '@mui/material';
// components
import Page from '../components/Page';
import { UserList } from '../sections/@dashboard/user';

// mock
import callApiHttp from '../utils/api';
import { actEnableToast } from 'src/actions/index';
import Combobox from 'src/components/Combobox';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const months = [
  {
    id: 1,
    title: '1 tháng',
    value: '1',
  },
  {
    id: 2,
    title: '3 tháng',
    value: '3',
  },
  {
    id: 3,
    title: '6 tháng',
    value: '6',
  },
  {
    id: 4,
    title: '12 tháng',
    value: '12',
  },
  {
    id: 5,
    title: 'Tất cả',
    value: 'all',
  },
];

const parseMonthToParam = (value) => {
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

export default function User({ isSeller }) {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const [openFilter, setOpenFilter] = useState(false);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('1');

  const fetchSellers = async () => {
    setMonth('1')
    try {
      const res = await callApiHttp({
        url: '/users',
        method: 'GET',
        params: {
          role: 'MANAGER',
        },
      });
      const { data } = res?.data;
      setUsers(data?.results);
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

  const fetchUsers = async () => {
    try {
      const res = await callApiHttp({
        url: '/users',
        method: 'GET',
        params: {
          role: 'USER',
          ...parseMonthToParam(month)
        },
      });
      const { data } = res?.data;
      setUsers(data?.results);
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
    if (isSeller) {
      fetchSellers();
      setTitle('Người bán');
    } else {
      fetchUsers();
      setTitle('Người mua');
    }
  }, [isSeller, month]);

  return (
    <Page title={title}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {!isSeller && (<Combobox label={'Thời gian'} items={months} value={month} setValue={setMonth} />)}

        </Stack>
        <UserList users={users} isSeller={isSeller}/>
      </Container>
    </Page>
  );
}
