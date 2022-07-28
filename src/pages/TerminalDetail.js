import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// @mui
import { Stack, Container, Typography, Button, Link, Breadcrumbs } from '@mui/material';
// hooks
import useUser from '../hooks/useUser';
// components
import Page from '../components/Page';
// sections
import { TerminalDetailForm } from '../sections/@dashboard/terminals';
import ConfirmDialog from 'src/components/ConfirmDialog';
import callApiHttp from '../utils/api';
import { actEnableToast } from '../actions/index';

// ----------------------------------------------------------------------

export default function TerminalDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const { id: terminalId } = useParams();
  const { account } = useUser();

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [terminal, setTerminal] = useState();

  const fetchTerminal = async () => {
    try {
      const res = await callApiHttp({
        url: `/terminals/${terminalId}`,
        method: 'GET',
      });
      setTerminal(res?.data?.data);
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
    fetchTerminal();
  }, []);

  const storeTerminalId = (id) => {
    localStorage.setItem('terminalId', id);
  };

  const restoreTerminalId = () => {
    localStorage.removeItem('terminalId');
  };

  const handleNewProduct = () => {
    storeTerminalId(terminalId);
    navigate('/dashboard/products/create', { replace: true });
  };

  const handleExtendTerminal = () => {
    storeTerminalId(terminalId);
    navigate('/dashboard/terminals/extend', { replace: true });
  };

  const handleSaveTerminal = () => {
    setIsEdit(false);
  };

  const handleRemoveTerminal = async () => {
    try {
      const res = await callApiHttp({
        url: `/terminals/${terminalId}`,
        method: 'DELETE',
      });
      console.log(res);
      restoreTerminalId();
      navigate('/dashboard/terminals', { replace: true });
      toast('Xóa gian hàng thành công');
    } catch (e) {
      console.log('e', e);
      let errText = 'Lỗi hệ thống';
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

  return (
    <Page title="Thông tin gian hàng">
      <Container>
        <Stack justifyContent="space-between">
          <Breadcrumbs aria-label="breadcrumb">
            <Link fontSize={'24px'} underline="hover" color="inherit" component={RouterLink} to="/dashboard/terminals">
              Gian hàng
            </Link>
            <Typography fontSize={'24px'} color="text.primary">
              Chi tiết gian hàng
            </Typography>
          </Breadcrumbs>
          {account?.role === 'MANAGER' && (
            <Stack direction="row" alignItems="center" mt={3}>
              <Stack alignItems="center" ml={15}>
                <Button variant="contained" onClick={() => setIsEdit((e) => !e)}>
                  Chỉnh sửa
                </Button>
              </Stack>
              <Stack alignItems="center" ml={5}>
                <Button variant="contained" onClick={handleExtendTerminal}>
                  Gia hạn gian hàng
                </Button>
              </Stack>
              <Stack alignItems="center" ml={5}>
                <Button variant="contained" onClick={handleNewProduct}>
                  Thêm sản phẩm mới
                </Button>
              </Stack>
              <Stack alignItems="center" ml={5}>
                <Button variant="contained" onClick={() => setOpen(true)}>
                  Xóa gian hàng
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
        <TerminalDetailForm id={terminalId} isEdit={isEdit} handleSaveTerminal={handleSaveTerminal} />
        <ConfirmDialog
          open={open}
          setOpen={setOpen}
          message={`Bạn có muốn xóa gian hàng ${terminal?.name} không?`}
          handleConfirm={handleRemoveTerminal}
        />
      </Container>
    </Page>
  );
}
