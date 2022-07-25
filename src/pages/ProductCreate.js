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

export default function TerminalCreate() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const id = localStorage.getItem('terminalId');

  return (
    <Page title="Thêm sản phẩm">
      <Container>
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
        <ProductCreateForm />
      </Container>
    </Page>
  );
}
