import { Link as RouterLink } from 'react-router-dom';

// material
import { Link } from '@mui/material';
import DataTable from '../../../components/Table';
// ----------------------------------------------------------------------


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
