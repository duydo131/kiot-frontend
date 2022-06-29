// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Gian hàng',
    path: '/dashboard/terminals',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Sản phẩm',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Người dùng',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Thống kê',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: 'Đăng nhập',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'Đăng Ký',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Đăng xuất',
    path: '/login',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
