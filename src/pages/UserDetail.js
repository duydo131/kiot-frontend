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

export default function UserDetail() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const { id: userId } = useParams();
  const [checkIsMe, setCheckIsMe] = useState(false);
  const [role, setRole] = useState('');
  const [link, setLink] = useState('sellers');

  return (
    <Page title="Thông tin người dùng">
      <Container>
        {!checkIsMe && (
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
        )}
        <UserDetailForm id={userId} setRole={setRole} setLink={setLink} setCheckIsMe={setCheckIsMe} />
      </Container>
    </Page>
  );
}
