import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// material
import { Stack, TextField, Checkbox, Typography, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Image from '../../../components/Image';
import callApiHttp from '../../../utils/api';
import { actEnableToast } from '../../../actions/index';

// ----------------------------------------------------------------------

const formatDate = (value) => {
  let d = new Date(value);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
};

function numberWithCommas(x) {
  if (typeof x === 'undefined') return x;
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

export default function ProductDetailForm({ id }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [product, setProduct] = useState([]);

  const fetchProductDetail = async (id) => {
    return await callApiHttp({
      url: `/products/${id}`,
      method: 'GET',
    });
  };

  useEffect(() => {
    Promise.all([fetchProductDetail(id)])
      .then((res) => {
        const { data } = res[0]?.data;
        setProduct(data);
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
  }, [id]);

  return (
    <Stack direction="row" spacing={2} alignItems="center" ml={-25}>
      <Stack spacing={2} alignItems="center">
        <Image link={product?.image}/>
      </Stack>
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tên sản phẩm
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {product?.name}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Mã sản phẩm
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {product?.code}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Sku
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {product?.sku}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Id
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {product?.id}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tên gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {product?.terminal_name}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Mã gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {product?.terminal_code}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Thời gian lên gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {formatDate(product?.created_at)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Trạng thái
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {product?.is_active ? 'Đã bán' : 'Chưa bán'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Thời gian mở bán
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {product?.is_active ? formatDate(product?.updated_at) : 'Chưa bán'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Số lượng sản phẩm còn lại
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {`${product?.quantity} Sản phẩm`}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Giá
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {`${numberWithCommas(product?.price)} đồng`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
