import { Navigate, useRoutes, Route } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import Terminals from './pages/Terminals';
import TerminalCreate from './pages/TerminalCreate';
import Payment from './pages/Payment';
import DashboardApp from './pages/DashboardApp';
import TerminalDetail from './pages/TerminalDetail';
import ProductDetail from './pages/ProductDetail';
import ProductCreate from './pages/ProductCreate';
import ImportProduct from './pages/ImportProduct';
import WorkloadHistory from './pages/WorkloadHistory';


// ----------------------------------------------------------------------

export default function Router({isLoggedIn}) {


  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'products/:id', element: <ProductDetail /> },
        { path: 'products/create', element: <ProductCreate /> },
        { path: 'import-product', element: <ImportProduct /> },
        { path: 'import-product/history', element: <WorkloadHistory /> },
        { path: 'terminals', element: <Terminals /> },
        { path: 'terminals/create', element: <TerminalCreate /> },
        { path: 'terminals/:id', element: <TerminalDetail /> }
      ],
    },
    {
      path: '/payment',
      element: isLoggedIn ?  <Payment />: <Navigate to="/login" />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/terminals" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
