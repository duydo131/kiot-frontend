import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// material
import { Stack, TextField, Checkbox, Typography, Link, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import DatePickerInt from '../../../components/DatePicker';
import Label from 'src/components/Label';
import DataTable from '../../../components/Table';

// ----------------------------------------------------------------------

const formatDate = (value) => {
  let d = new Date(value);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
};

const days = (value_1, value_2) => {
  let date_1 = new Date(value_1);
  let date_2 = new Date(value_2);
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

const columns = [
  {
    field: 'name',
    headerName: 'Tên sản phẩm',
    width: 250,
    renderCell: (params) => (
      <strong>
        <Link underline="hover" component={RouterLink} to={`/dashboard/products/${params.row.id}`}>
          {params.row.name}
        </Link>
      </strong>
    ),
  },
  { field: 'code', headerName: 'Mã', width: 240 },
  {
    field: 'sku',
    headerName: 'Sku',
    width: 100,
  },
  {
    field: 'is_active',
    headerName: 'Trạng thái',
    width: 90,
    valueGetter: (params) => (params.row.is_active ? 'Đã bán' : 'Chưa bán'),
  },
  {
    field: 'price',
    headerName: 'Giá sản phẩm',
    type: 'number',
    width: 100,
  },
];

export default function TerminalDetailForm({ id, isEdit, handleSaveTerminal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [terminal, setTerminal] = useState(null);
  const [products, setProducts] = useState([]);
  const [nameTerminal, setNameTerminal] = useState('');
  const [isUpdate, setIsUpdate] = useState(false)

  const fetchTerminalDetail = async (id) => {
    return await callApiHttp({
      url: `/terminals/${id}`,
      method: 'GET',
    });
  };

  const fetchProduct = async (id) => {
    return await callApiHttp({
      url: `/products`,
      method: 'GET',
      params: {
        terminal_id: id,
      },
    });
  };

  const updateTerminal = async () => {
    console.log("nameTerminal", nameTerminal)
    return await callApiHttp({
      url: `/terminals/${id}`,
      method: 'PATCH',
      data: {
        ...terminal,
        name: nameTerminal,
      },
    });
  }

  useEffect(() => {
    Promise.all([fetchTerminalDetail(id), fetchProduct(id)])
      .then((res) => {
        const { data } = res[0]?.data;
        setTerminal(data);
        setNameTerminal(data?.name);
        const { results } = res[1]?.data?.data;
        setProducts(results);
      })
      .catch((e) => {
        console.log('e', e);
        let err = e?.response?.data?.data;
        let errText = 'Lỗi hệ thống';
        if (typeof err === 'object') {
          errText = '';
          for (let key in err) {
            errText += `${key} : ${err[key]} \n`;
          }
        }
        toast(errText);
      });
  }, [id, isUpdate]);

  const handleUpdateTerminal = async () => {
    Promise.all([updateTerminal()]).then((res) => {
      toast("Cập nhật thành công")
      setIsUpdate(x => !x)
      handleSaveTerminal()
    }).catch((e) => {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Lỗi hệ thống';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    });
  }

  return (
    <Stack spacing={2} alignItems="center" mt={5} >
      <Stack direction="row" alignItems="center" width={748}>
        <Typography component="h4" ml={3} width={200}>
          Tên gian hàng
        </Typography>
        {isEdit ? (
          <Stack direction="row" alignItems="center" ml={3}>
            <TextField
              size='small'
              fullWidth
              label="Tên gian hàng"
              value={nameTerminal}
              onChange={(e) => setNameTerminal(e.target.value)}
            />
            <Button onClick={handleUpdateTerminal}>Save</Button>
          </Stack>
        ) : (
          <Typography  component="h4" ml={3} width={500}>
            {terminal?.name}
          </Typography>
        )}
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Mã gian hàng
        </Typography>
        <Typography component="h4" ml={3} width={500}>
          {terminal?.code}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Id
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {terminal?.id}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Trạng thái
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {terminal?.status ? 'Đã mở' : 'Chưa mở'}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Thời gian đăng ký
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {formatDate(terminal?.created_at)}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Thời gian mở cửa
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {formatDate(terminal?.time_open)}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Thời gian mở cửa đầu tiên
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {formatDate(terminal?.time_register)}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Thời gian đăng ký mở bán
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {`${terminal?.time_selling} Ngày`}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Thời gian mở bán
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {`${Math.max(days(new Date().toLocaleDateString(), terminal?.time_open), 0)} Ngày`}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Số sản phẩm tối đa
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {`${terminal?.max_quantity_product} Sản phẩm`}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography component="h4" ml={3} width={200}>
          Số sản phẩm hiện tại
        </Typography>
        <Typography component="h5" ml={3} width={500}>
          {`${terminal?.total_product} Sản phẩm`}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Typography variant="h5" component="h4" mt={5} ml={3} width={200}>
          Danh sách sản phẩm
        </Typography> 
      </Stack>
      <Stack direction="row" alignItems="center" width={800}>
        <DataTable rows={products} columns={columns} />
      </Stack>
    </Stack>
  );
}
