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

export default function ProductListTable({ products, ...other }) {
  const columns = [
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <strong>
          <Link underline="hover" component={RouterLink} to={`/dashboard/products/${params.row.id}`}>
            {params.row.name}
          </Link>
        </strong>
      ),
    },
    { field: 'code', headerAlign: 'center', align: 'center', headerName: 'Mã', width: 240 },
    {
      field: 'sku',
      headerName: 'Sku',
      headerAlign: 'center',
      align: 'center',
      width: 100,
    },
    {
      field: 'is_active',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      valueGetter: (params) => (params.row.is_active ? 'Đã bán' : 'Chưa bán'),
    },
    {
      field: 'price',
      headerName: 'Giá sản phẩm',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      width: 120,
    },
    {
      field: 'terminal_name',
      headerAlign: 'center',
      align: 'center',
      headerName: 'Gian hàng',
      width: 100,
    },
  ];

  return <DataTable rows={products} columns={columns} />;
}
