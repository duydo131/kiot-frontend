import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material
import { Container, Stack, Typography, Button, Breadcrumbs, Link } from '@mui/material';
// components
import Page from '../components/Page';
import { TerminalList } from '../sections/@dashboard/terminals';
import callApiHttp from '../utils/api';
import { actEnableToast } from 'src/actions/index';
import useUser from '../hooks/useUser';

// ----------------------------------------------------------------------

export default function Terminals() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const [openFilter, setOpenFilter] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const { account } = useUser();

  const fetchTerminals = async () => {
    try {
      const res = await callApiHttp({
        url: '/terminals/all',
        method: 'GET',
      });
      const { data } = res?.data;
      setTerminals(data);
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
    fetchTerminals();
  }, []);

  const handleNewTerminal = () => {
    navigate('/dashboard/terminals/create', { replace: true });
  };

  return (
    <>
      <Page title="Gian hàng">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Typography fontSize={'24px'} color="text.primary">
                  Gian hàng
                </Typography>
              </Breadcrumbs>
            </Typography>
            {account?.role === 'MANAGER' && (
              <Button variant="contained" onClick={handleNewTerminal}>
                Tạo gian hàng mới
              </Button>
            )}
          </Stack>

          <TerminalList terminals={terminals} />
        </Container>
      </Page>
    </>
  );
}
