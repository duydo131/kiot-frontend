import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Account from '../components/Account';
import Logo from '../components/Logo';
// sections
import { RegisterForm } from '../sections/auth/register';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Đăng ký">
      <RootStyle>
      <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Đăng ký tài khoản mới
            </Typography>
            <RegisterForm />
            <Account description={'Có tài khoản. Đăng nhập!'} url={'/login'}/>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
