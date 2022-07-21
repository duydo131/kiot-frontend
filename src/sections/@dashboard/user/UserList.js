import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

const genderToName = (gender) => {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    default:
      return 'Chưa rõ';
  }
};

export default function UserList({ users, isSeller, ...other }) {
  let columns = [
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
    
  ];

  const sellerColumns = [
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
  ]

  const userColumns = [
    {
      field: 'address',
      headerName: 'Địa chỉ',
      headerAlign: 'center',
      align: 'center',
      width: 230,
      valueGetter: (params) => params.row.address  || 'Chưa có',
    },
    {
      field: 'total_order',
      headerName: 'Tổng đơn hàng',
      headerAlign: 'center',
      align: 'center',
      width: 150,
    },
  ]

  const [realColumns, setRealColumns] = useState([])

  useEffect(() => {
    isSeller ? setRealColumns(columns.concat(sellerColumns)) : setRealColumns(columns.concat(userColumns))
  }, [isSeller])

  return <DataTable rows={users} columns={realColumns} />;
}
