// routes
import Router from './routes';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// theme
import ThemeProvider from './theme';

// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import Toast from './components/toast/Toast';

import callApiHttp from './utils/api';

// ----------------------------------------------------------------------

export default function App() {
  const isLoggedIn = useSelector((state) => state.auth.login);

  const navigate = useNavigate();

  const checkCurrentUser = async () => {
    try {
      const res = await callApiHttp({
        url: '/users/me',
        method: 'GET',
      });
      const { role } = res?.data?.data;
      if (role !== 'MANAGER' && role !== 'ADMIN') {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (e) {}
  };

  useEffect(() => {
    if(isLoggedIn) checkCurrentUser()
  }, [isLoggedIn]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router isLoggedIn={isLoggedIn} />
      <Toast />
    </ThemeProvider>
  );
}
