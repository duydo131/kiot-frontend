// routes
import Router from './routes';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// theme
import ThemeProvider from './theme';

// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import Toast from './components/toast/Toast';

import callApiHttp from './utils/api';
// action
import { actEnableToast } from './actions/index';

// ----------------------------------------------------------------------

export default function App() {
  const isLoggedIn = useSelector((state) => state.auth.login);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

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
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      // toast(errText);
    }
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
