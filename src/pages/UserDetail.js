import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Breadcrumbs, Link } from '@mui/material';
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
  const [checkIsMe, setCheckIsMe] = useState(false)
  const [role, setRole] = useState('');
  const [link, setLink] = useState('sellers')

  return (
    <Page title="Thông tin người dùng">
      <RootStyle>
        <HeaderStyle>
          {
            checkIsMe
              ?
              null
              :
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" sx={{ mb: 5 }}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      fontSize={'24px'}
                      underline="hover"
                      color="inherit"
                      component={RouterLink}
                      to={`/dashboard/${link}`}
                    >
                      {`Danh sách ${role}`}
                    </Link>
                    <Typography fontSize={'24px'} color="text.primary">
                      {`Chi tiết ${role}`}
                    </Typography>
                  </Breadcrumbs>
                </Typography>
                {/* <Typography variant="h4">{`Chi tiết ${role}`}</Typography> */}
              </Stack>
          }
        </HeaderStyle>
        <Container>
          <ContentStyle>
            <UserDetailForm id={userId} setRole={setRole} setLink={setLink} setCheckIsMe={setCheckIsMe} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
