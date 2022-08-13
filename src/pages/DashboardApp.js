// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Stack } from '@mui/material';
// components
import Page from '../components/Page';
// sections
import { RevenueAndCost, Order, OrderRevenue, RevenueByTime } from '../sections/@dashboard/chart.js';
import { useState } from 'react';
// component
import Combobox from 'src/components/Combobox';

// hook
import useUser from 'src/hooks/useUser';

// ----------------------------------------------------------------------

const types = [
  {
    id: 1,
    title: 'Theo doanh thu và chi phí',
    value: 1,
  },
  {
    id: 2,
    title: 'Theo số lượng đơn hàng',
    value: 2,
  },
];

const admin_types = [
  {
    id: 3,
    title: 'Thống kê theo người dùng',
    value: 3,
  },
  {
    id: 4,
    title: 'Thống kê doanh thu theo thời gian',
    value: 4,
  },
];

export default function DashboardApp() {
  const theme = useTheme();
  const { account } = useUser();
  const [value, setValue] = useState(1);

  return (
    <Page title="Thống kê">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" spacing={3}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Thống kê
          </Typography>

          <Combobox
            label={'Loại thống kê'}
            items={account?.role === 'MANAGER' ? types : types.concat(admin_types)}
            value={value}
            setValue={setValue}
            sx={{ minWidth: 330 }}
          />
        </Stack>

        <Grid container alignItems="center" justify="center" spacing={10} mt={0}>
          {value === 1 && (
            <Grid alignItems="center" justify="center" item xs={12} sm={12} md={12}>
              <RevenueAndCost />
            </Grid>
          )}
          {value === 2 && (
            <Grid alignItems="center" justify="center" item xs={12} sm={12} md={12}>
              <Order />
            </Grid>
          )}
          {account?.role === 'ADMIN' && value === 3 && (
            <Grid alignItems="center" justify="center" item xs={12} sm={12} md={12}>
              <OrderRevenue />
            </Grid>
          )}
          {account?.role === 'ADMIN' && value === 4 && (
            <Grid alignItems="center" justify="center" item xs={12} sm={12} md={12}>
              <RevenueByTime />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
