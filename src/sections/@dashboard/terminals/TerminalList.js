import { Link as RouterLink, useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
// material
import { Link } from '@mui/material';
// import ShopProductCard from './ProductCard';
import DataTable from '../../../components/Table'
// ----------------------------------------------------------------------

function formatDate(value) {
  let d = new Date(value)
  return  d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear()
}

TerminalList.propTypes = {
  terminals: PropTypes.array.isRequired
};

export default function TerminalList({ terminals, ...other }) {
  const columns = [
    { 
      field: 'name', 
      headerName: 'Tên', 
      width: 130,
      renderCell: (params) => (
        <strong>
          <Link underline='hover' component={RouterLink} to={`${params.row.id}`}>
            {params.row.name}
          </Link>
        </strong>
      ),
    },
    { field: 'code', headerName: 'Mã', width: 130 },
    { 
      field: 'time_register', 
      headerName: 'Thời gian đăng ký', 
      width: 150,
      valueGetter: (params) => formatDate(params.row.time_register),
    },
    { 
      field: 'expired_at', 
      headerName: 'Thới gian hết hạn', 
      width: 150,
      valueGetter: (params) => formatDate(params.row.expired_at),
    },
    {
      field: 'max_quantity_product',
      headerName: 'Số sản phẩm tối đa',
      type: 'number',
      width: 190,
    },
    {
      field: 'total_product',
      headerName: 'Tổng sản phẩm',
      type: 'number',
      width: 150,
    },
  ];

  return (
    <DataTable rows={terminals} columns={columns}/>
  );
}
