import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
// import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';

import callApiHttp from '../../utils/api';
import { actEnableToast } from '../../actions/index';
import { DEFAULT_AVATAR_USER } from '../../constants/httpConstants';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

const getRole = (role) => {
  switch (role) {
    case 'MANAGER':
      return 'Người bán hàng';
    case 'ADMIN':
      return 'Quản lý';
    default:
      return '';
  }
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.login);
  const changeAvatar = useSelector((state) => state.changeAvatar);
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [account, setAccount] = useState();

  const isDesktop = useResponsive('up', 'lg');

  const getCurrentUser = async () => {
    try {
      const res = await callApiHttp({
        url: '/users/me',
        method: 'GET',
      });
      const { data } = res?.data;
      setAccount(data);
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
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
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    getCurrentUser();
  }, [isLoggedIn, changeAvatar]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      {/* account */}
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="blue" component={RouterLink} to={`/dashboard/users/${account?.id}`}>
          <AccountStyle>
            <Avatar src={account?.avatar_url || DEFAULT_AVATAR_USER} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account?.name || account?.username}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {getRole(account?.role)}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {(
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
