import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Button, Link, Breadcrumbs } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { TerminalDetailForm } from '../sections/@dashboard/terminals';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  marginTop: '-5%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function TerminalDetail() {
  const navigate = useNavigate();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const { id: terminalId } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  const storeTerminalId = (id) => {
    localStorage.setItem('terminalId', id);
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

  return (
    <Page title="Thông tin gian hàng">
      <RootStyle>
        <HeaderStyle>
          <Stack justifyContent="space-between">
            <Breadcrumbs aria-label="breadcrumb">
              <Link fontSize={'24px'} underline="hover" color="inherit" component={RouterLink} to="/dashboard/terminals">
                Gian hàng
              </Link>
              <Typography fontSize={'24px'} color="text.primary">
                Chi tiết gian hàng
              </Typography>
            </Breadcrumbs>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
              {/* <Typography variant="h4">Chi tiết gian hàng</Typography> */}
              <Stack alignItems="center" justifyContent="space-between" ml={15}>
                <Button variant="contained" onClick={() => setIsEdit((e) => !e)}>
                  Chỉnh sửa
                </Button>
              </Stack>
              <Stack alignItems="center" justifyContent="space-between" ml={5}>
                <Button variant="contained" onClick={handleExtendTerminal}>
                  Gia hạn gian hàng
                </Button>
              </Stack>
              <Stack alignItems="center" justifyContent="space-between" ml={5}>
                <Button variant="contained" onClick={handleNewProduct}>
                  Thêm sản phẩm mới
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <TerminalDetailForm id={terminalId} isEdit={isEdit} handleSaveTerminal={handleSaveTerminal} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
