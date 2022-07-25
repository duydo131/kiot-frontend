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
import useUser from '../../../hooks/useUser';

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
  const [selectedFile, setSelectedFile] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
  });
  const { account } = useUser();

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
        setNewProduct({
          name: data.name,
          price: data.price,
        });
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

  const changeImageProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const upload = await callApiHttp({
        baseUrl: 'http://localhost:8080',
        url: '/upload',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('upload', upload);

      var payload = {
        ...product,
        image: upload?.data?.filepath,
      };
      const res = await callApiHttp({
        url: `/products/${product.id}`,
        method: 'PATCH',
        data: payload,
      });
      const { data } = res?.data;
      console.log('data', data);
      setFetch((e) => !e);
      setIsEdit(false);
      setSelectedFile(undefined);
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Cập nhật ảnh sản phẩm thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    }
  };

  const updateProduct = async () => {
    return await callApiHttp({
      url: `/products/${id}`,
      method: 'PATCH',
      data: {
        ...product,
        ...newProduct,
      },
    });
  }

  const handleUpdateProduct = async () => {
    Promise.all([updateProduct()]).then((res) => {
      toast("Cập nhật thành công")
      setIsUpdate(x => !x)
      setFetch(x => !x)
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
    <Stack direction="row" spacing={2} alignItems="center" ml={-25}>
      <Stack spacing={2} alignItems="center">
        {isEdit && (
          <LoadImage selectedFile={selectedFile} setSelectedFile={setSelectedFile} style={{ marginRight: '5%' }} />
        )}
        {selectedFile === undefined && <Image isProduct={true} link={product?.image} onClick={() => setIsEdit((e) => !e)} />}
        {isEdit && (
          <Stack direction="row" alignItems="center">
            <Button variant="contained" style={{ marginRight: '5px' }} onClick={changeImageProduct}>
              Cập nhật ảnh
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setIsEdit((e) => !e), setSelectedFile(undefined);
              }}
            >
              Hủy
            </Button>
          </Stack>
        )}
      </Stack>
      <Stack spacing={2} alignItems="center">
        {
          account?.role === 'MANAGER' && !isUpdate && (
            <Stack direction="row" alignItems="center" ml={-60}>
          <Button variant="contained" onClick={() => setIsUpdate((e) => !e)}>
            Thay đổi thông tin sản phẩm
          </Button>
        </Stack>
          )
        }

        <Stack direction="row" alignItems="center" sx={{width: '100%'}}>
          <Typography component="h4" ml={3} width={200}>
            Tên sản phẩm
          </Typography>
          {isUpdate ? (
            <Stack direction="row" alignItems="center" ml={3} width={300}>
              <TextField
                size='small'
                label="Tên sản phẩm"
                fullWidth
                value={newProduct.name}
                onChange={(e) => {
                  let p = { ...newProduct };
                  p.name = e.target.value;
                  setNewProduct(p);
                }}
              />
            </Stack>
          ) : (
            <Typography component="h4" ml={3} width={500}>
              {product?.name}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Mã sản phẩm
          </Typography>
          <Typography component="h4" ml={3} width={500}>
            {product?.code}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography component="h4" ml={3} width={200}>
            Sku
          </Typography>
          <Typography component="h4" ml={3} width={500}>
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

        <Stack direction="row" alignItems="center" sx={{width: '100%'}}>
          <Typography component="h4" ml={3} width={200} >
            Giá
          </Typography>
          {isUpdate ? (
            <Stack direction="row" alignItems="center" ml={3}>
              <TextField
                size='small'
                fullWidth
                label="Giá"
                value={newProduct?.price}
                onChange={(e) => {
                  let p = { ...newProduct };
                  p.price = e.target.value;
                  setNewProduct(p);
                }}
              />
            </Stack>
          ) : (
            <Typography component="h5" ml={3} width={500}>
              {`${numberWithCommas(product?.price)} đồng`}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center">
        {isUpdate && (
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button variant="contained" onClick={handleUpdateProduct}> Cập nhật</Button>
            <Button variant="contained" onClick={() => setIsUpdate(false)}> Hủy</Button>
        </Stack>
        )}
        </Stack>
      </Stack>
    </Stack>
  );
}
