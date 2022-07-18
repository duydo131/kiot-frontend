import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';
import { UserList } from '../sections/@dashboard/user';

// mock
import callApiHttp from '../utils/api';
import { actEnableToast } from 'src/actions/index';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export default function User() {
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const [openFilter, setOpenFilter] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await callApiHttp({
        url: '/users',
        method: 'GET',
        params: {
          'role': "MANAGER"
        }
      });
      const { data } = res?.data;
      console.log('users', data)
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
    fetchUsers();
  }, []);


  return (
    <Page title="Người dùng">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>

          <UserList users={users}/>
      </Container>
    </Page>
  );
}
