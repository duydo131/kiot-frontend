// routes
import Router from './routes';
import { useSelector } from 'react-redux';

// theme
import ThemeProvider from './theme';

// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import Toast from './components/toast/Toast'

// ----------------------------------------------------------------------

export default function App() {
  const isLoggedIn = useSelector(state => state.auth.login);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router isLoggedIn={isLoggedIn}/>
      <Toast />
    </ThemeProvider>
  );
}
