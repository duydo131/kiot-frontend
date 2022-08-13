import { Navigate, useRoutes, Route } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import User from './pages/User';
import UserDetail from './pages/UserDetail';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import Terminals from './pages/Terminals';
import TerminalCreate from './pages/TerminalCreate';
import TerminalExtend from './pages/TerminalExtend';
import Payment from './pages/Payment';
import DashboardApp from './pages/DashboardApp';
import TerminalDetail from './pages/TerminalDetail';
import ProductDetail from './pages/ProductDetail';
import ProductCreate from './pages/ProductCreate';
import ImportProduct from './pages/ImportProduct';
import WorkloadHistory from './pages/WorkloadHistory';
import Home from './pages/Home';


// ----------------------------------------------------------------------

export default function Router({isLoggedIn}) {


  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'home', element: <Home /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'sellers', element: <User isSeller={true}/> },
        { path: 'users', element: <User isSeller={false}/> },
        { path: 'users/:id', element: <UserDetail /> },
        { path: 'sellers/:id', element: <UserDetail /> },
        { path: 'products', element: <Products /> },
        { path: 'products/:id', element: <ProductDetail /> },
        { path: 'products/create', element: <ProductCreate /> },
        { path: 'import-product', element: <ImportProduct /> },
        { path: 'import-product/history', element: <WorkloadHistory /> },
        { path: 'terminals', element: <Terminals /> },
        { path: 'terminals/create', element: <TerminalCreate /> },
        { path: 'terminals/extend', element: <TerminalExtend /> },
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
        { path: '/', element: <Navigate to="/dashboard/home" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
