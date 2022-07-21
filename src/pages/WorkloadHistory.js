import { Link as RouterLink, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Breadcrumbs, Link } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import callApiHttp from '../utils/api';
// sections
import { WorkloadHistoryList } from '../sections/@dashboard/products';

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
  maxWidth: 1200,
  margin: 'auto',
  marginTop: '-12%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function WorkloadHistoryDetail() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [workloads, setWorkloads] = useState([]);

  const fetchWorkloads = async () => {
    try {
      const res = await callApiHttp({
        url: '/workload',
        method: 'GET',
      });
      const { results } = res?.data?.data;
      setWorkloads(results);
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
    fetchWorkloads();
  }, []);

  return (
    <Page title="Lịch sử Import">
      <RootStyle>
        <HeaderStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Breadcrumbs aria-label="breadcrumb">
              <Link fontSize={'24px'} underline="hover" color="inherit" component={RouterLink} to="/dashboard/import-product">
                Import sản phẩm
              </Link>
              <Typography fontSize={'24px'} color="text.primary">Thông tin import sản phẩm</Typography>
            </Breadcrumbs>
          </Stack>
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <WorkloadHistoryList workloads={workloads} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
