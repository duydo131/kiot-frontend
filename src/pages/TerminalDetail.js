import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Button } from '@mui/material';
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
  marginTop: '-10%',
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

  const storeTerminalId = (id) => {
    localStorage.setItem('terminalId', id)
  }

  const handleNewProduct = () => {
    storeTerminalId(terminalId);
    navigate('/dashboard/products/create', { replace: true });
  };

  const handleImportProduct = () => {
    storeTerminalId(terminalId);
    navigate('/dashboard/terminals', { replace: true });
  };

  return (
    <Page title="Thông tin gian hàng">
      <RootStyle>
        <HeaderStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Chi tiết gian hàng</Typography>
            <Stack alignItems="center" justifyContent="space-between" ml={20}>
              <Button variant="contained" onClick={handleNewProduct}>
                Thêm sản phẩm mới
              </Button>
            </Stack>
            <Stack alignItems="center" justifyContent="space-between" ml={2}>
              <Button variant="contained" onClick={handleImportProduct}>
                Import sản phẩm
              </Button>
            </Stack>
          </Stack>
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <TerminalDetailForm id={terminalId} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
