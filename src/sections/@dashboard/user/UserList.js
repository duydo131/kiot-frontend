import { Link as RouterLink, useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
// material
import { Link } from '@mui/material';
// import ShopProductCard from './ProductCard';
import DataTable from '../../../components/Table';
// ----------------------------------------------------------------------

function formatDate(value) {
  let d = new Date(value);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}

export default function UserList({ users, ...other }) {
  const columns = [
    {
      field: 'name',
      headerName: 'Tên',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <strong>
          <Link underline="hover" component={RouterLink} to={`${params.row.id}`}>
            {params.row.name}
          </Link>
        </strong>
      ),
    },
    { field: 'email', headerAlign: 'center', align: 'center', headerName: 'Email', width: 180 },
    {
      field: 'created_at',
      headerName: 'Thời gian mở tài khoản',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => formatDate(params.row.created_at),
    },
    {
      field: 'total_terminal',
      headerName: 'Số gian hàng',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 190,
    },
    {
      field: 'total_product',
      headerName: 'Tổng sản phẩm',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 150,
    },
  ];

  return <DataTable rows={users} columns={columns} />;
}
