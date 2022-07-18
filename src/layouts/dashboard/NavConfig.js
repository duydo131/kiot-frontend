// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Gian hàng',
    path: '/dashboard/terminals',
    icon: getIcon('eva:shopping-bag-fill'),
    isAdmin: false,
    isApplyAll: false
  },
  // {
  //   title: 'Sản phẩm',
  //   path: '/dashboard/products',
  //   icon: getIcon('eva:shopping-bag-fill'),
  // },
  {
    title: 'Import sản phẩm',
    path: '/dashboard/import-product',
    icon: getIcon('eva:shopping-bag-fill'),
    isAdmin: false,
    isApplyAll: false
  },
  {
    title: 'Người dùng',
    path: '/dashboard/users',
    icon: getIcon('eva:people-fill'),
    isAdmin: true,
    isApplyAll: false
  },
  {
    title: 'Thống kê',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
    isAdmin: false,
    isApplyAll: true
  },
  // {
  //   title: 'Đăng nhập',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'Đăng Ký',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  {
    title: 'Đăng xuất',
    path: '/login',
    icon: getIcon('eva:alert-triangle-fill'),
    isAdmin: false,
    isApplyAll: true
  },
];

export default navConfig;
