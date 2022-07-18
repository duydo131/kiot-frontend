import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { UserDetailForm } from '../sections/@dashboard/user';

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
  marginTop: '-12%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function UserDetail() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const { id: userId } = useParams();

  const [isManager, setIsManager] = useState(false)

  return (
    <Page title="Thông tin người dùng">
      <RootStyle>
        <HeaderStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">
              {`Chi tiết người ${isManager ? "bán" : "mua hàng"}`}
            </Typography>
          </Stack>
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <UserDetailForm id={userId} setIsManager={setIsManager}/>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
