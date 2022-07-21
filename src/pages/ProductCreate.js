import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Breadcrumbs, Link } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { ProductCreateForm } from '../sections/@dashboard/products';

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

export default function TerminalCreate() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const id = localStorage.getItem('terminalId');

  return (
    <Page title="Thêm sản phẩm">
      <RootStyle>
        <HeaderStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  fontSize={'24px'}
                  underline="hover"
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard/terminals"
                >
                  Gian hàng
                </Link>
                <Link
                  fontSize={'24px'}
                  underline="hover"
                  color="inherit"
                  component={RouterLink}
                  to={`/dashboard/terminals/${id}`}
                >
                  Chi tiết gian hàng
                </Link>
                <Typography fontSize={'24px'} color="text.primary">
                  Thêm sản phẩm mới
                </Typography>
              </Breadcrumbs>
            </Typography>
          </Stack>
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <ProductCreateForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
