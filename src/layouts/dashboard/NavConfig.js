// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    id: 1,
    title: 'Gian hàng',
    path: '/dashboard/terminals',
    icon: getIcon('fa-solid:store'),
    isAdmin: false,
    isApplyAll: true,
  },
  {
    title: 'Sản phẩm',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
    isAdmin: false,
    isApplyAll: true,
  },
  {
    id: 2,
    title: 'Import sản phẩm',
    path: '/dashboard/import-product',
    icon: getIcon('eva:shopping-bag-fill'),
    isAdmin: false,
    isApplyAll: false,
  },
  {
    id: 3,
    title: 'Người dùng',
    icon: getIcon('eva:people-fill'),
    isAdmin: true,
    isApplyAll: false,
    children: [
      {
        id: 4,
        title: 'Người mua',
        path: '/dashboard/users',
      },
      {
        id: 5,
        title: 'Người bán',
        path: '/dashboard/sellers',
      },
    ],
  },
  {
    id: 7,
    title: 'Thống kê',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
    isAdmin: false,
    isApplyAll: true,
  },
  {
    id: 6,
    title: 'Đăng xuất',
    path: '/login',
    icon: getIcon('eva:alert-triangle-fill'),
    isAdmin: false,
    isApplyAll: true,
  },
];

export default navConfig;
