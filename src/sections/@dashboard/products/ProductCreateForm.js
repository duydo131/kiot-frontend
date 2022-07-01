import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import callApiHttp from '../../../utils/api';
import { actEnableToast } from '../../../actions/index';
import LoadImage from '../../../components/LoadImage';

import Label from 'src/components/Label';

// ----------------------------------------------------------------------

export default function ProductCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [terminalId, setTerminalId] = useState(null);
  const [terminal, setTerminal] = useState(null);
  const [selectedFile, setSelectedFile] = useState();

  const fetchTerminalDetail = async (id) => {
    return await callApiHttp({
      url: `/terminals/${id}`,
      method: 'GET',
    });
  };

  useEffect(() => {
    const id = localStorage.getItem('terminalId');
    setTerminalId(id);

    Promise.all([fetchTerminalDetail(id)])
      .then((res) => {
        const { data } = res[0]?.data;
        console.log(data);
        setTerminal(data);
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
  }, [terminalId]);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    sku: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Code is required'),
    price: Yup.number().min(1000, 'greater than 1000').required('time selling is required'),
    quantity: Yup.number().min(1, 'greater than 1').required('max quantity product is required'),
  });

  const addProduct = async (values) => {
    try{
      let upload = null
      if (selectedFile !== undefined){
        const formData = new FormData();
        formData.append('file', selectedFile);
        upload  = await callApiHttp({
          baseUrl: 'http://localhost:8080',
          url: '/upload',
          method: 'POST',
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log('upload', upload);
      }

      var payload = {
        name: values['name'],
        sku: values['sku'],
        price: values['price'],
        quantity: values['quantity'],
        terminal_code: terminal.code,
        image: upload?.data?.filepath
      };
      const res  = await callApiHttp({
        url: '/products',
        method: 'POST',
        data: payload,
      });
      const { data } = res?.data;
      console.log('data', data);
      navigate(`/dashboard/products/${data.id}`, { replace: true });
    }catch(e){
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Thêm sản phẩm thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
      setLoading(false)
      navigate('/dashboard/products/create', { replace: true });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      sku: '',
      price: 0,
      qauntity: 0,
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      Promise.all([addProduct(values)])
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const [loading, setLoading] = useState(isSubmitting)
  useEffect(() => {
    setLoading(isSubmitting)
  }, [isSubmitting])

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="name"
            type="text"
            label="Tên sản phẩm"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            autoComplete="sku"
            type="text"
            label="Sku sản phẩm"
            {...getFieldProps('sku')}
            error={Boolean(touched.sku && errors.sku)}
            helperText={touched.sku && errors.sku}
          />

          <TextField
            fullWidth
            type="number"
            label="Giá"
            {...getFieldProps('price')}
            error={Boolean(touched.price && errors.price)}
            helperText={touched.price && errors.price}
          />

          <TextField
            fullWidth
            type="number"
            label="Số lượng sản phẩm"
            {...getFieldProps('quantity')}
            error={Boolean(touched.quantity && errors.quantity)}
            helperText={touched.quantity && errors.quantity}
          />

          <Stack direction="row" alignItems="center">
            <Label> {' Chọn ảnh '} </Label>
            <LoadImage
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              style={{ marginRight: '5%' }}
            />
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Thêm sản phẩm mới
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
