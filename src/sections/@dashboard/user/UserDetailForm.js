import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// material
import { Stack, TextField, Checkbox, Typography, Link, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Image from '../../../components/Image';
import callApiHttp from '../../../utils/api';
import { actEnableToast } from '../../../actions/index';
import LoadImage from '../../../components/LoadImage';

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

export default function UserDetailForm({ id, setIsManager }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const [selectedFile, setSelectedFile] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [user, setUser] = useState([]);

  const fetchUserDetail = async (id) => {
    return await callApiHttp({
      url: `/users/${id}`,
      method: 'GET',
    });
  };

  useEffect(() => {
    Promise.all([fetchUserDetail(id)])
      .then((res) => {
        const { data } = res[0]?.data;
        console.log('user detail', data)
        setUser(data);
        data.role === 'MANAGER' ? setIsManager(true) : setIsManager(false)
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
  }, [id, fetch]);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack spacing={2} alignItems="center">
        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tên sản phẩm
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {user?.name}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Mã sản phẩm
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {user?.code}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Sku
          </Typography>
          <Typography variant="h5" component="h4" ml={3} width={500}>
            {user?.sku}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Id
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.id}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Tên gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.terminal_name}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Mã gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.terminal_code}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Thời gian lên gian hàng
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {formatDate(user?.created_at)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Trạng thái
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.is_active ? 'Đã bán' : 'Chưa bán'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Thời gian mở bán
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.is_active ? formatDate(user?.updated_at) : 'Chưa bán'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Số lượng sản phẩm còn lại
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {`${user?.quantity} Sản phẩm`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
