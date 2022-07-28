import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import { Stack, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import DatePickerInt from '../../../components/DatePicker';
import Label from 'src/components/Label';

// ----------------------------------------------------------------------
function formatDate(value) {
  let d = new Date(value);
  return (
    d.getDate() +
    '/' +
    (d.getMonth() + 1) +
    '/' +
    d.getFullYear() +
    ' ' +
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds()
  );
}

export default function TerminalCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const infoPayment = (handlerId, amount, type, payload) => dispatch(actPayment(handlerId, amount, type, payload));

  const [openNow, setOpenNow] = useState(false);
  const [timeOpen, setTimeOpen] = useState(null);

  const handleOnTypeChange = (e) => {
    setOpenNow((x) => !x);
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    code: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Code is required'),
    time_selling: Yup.number().required('time selling is required'),
    max_quantity_product: Yup.number().required('max quantity product is required'),
  });

  const register = async (values) => {
    var payload = {
      name: values['name'],
      code: values['code'],
      time_selling: values['time_selling'],
      max_quantity_product: values['max_quantity_product'],
      type_time_open: openNow ? 'NOW' : 'AFTER',
      time_open: formatDate(timeOpen),
    };
    return await callApiHttp({
      url: '/terminals/register',
      method: 'POST',
      data: payload,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      time_selling: 0,
      max_quantity_product: 0,
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      Promise.all([register(values)])
        .then((res) => {
          const { data } = res[0]?.data;
          infoPayment(data.terminal.id, data.total_price, 'REGISTER_TERMINAL', {});
          navigate('/payment', { replace: true });
        })
        .catch((e) => {
          console.log('e', e);
          let err = e?.response?.data?.data;
          let errText = 'Đăng kí thất bại';
          if (typeof err === 'object') {
            errText = '';
            for (let key in err) {
              errText += `${key} : ${err[key]} \n`;
            }
          }
          toast(errText);
          setLoading(false);
          navigate('/dashboard/terminals/create', { replace: true });
        });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const [loading, setLoading] = useState(isSubmitting);
  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  const onCancelCreateTerminal = () => {
    navigate(`/dashboard/terminals`, { replace: true });
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tên gian hàng"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />

          <TextField
            fullWidth
            autoComplete="code"
            type="text"
            label="Mã gian hàng"
            {...getFieldProps('code')}
            error={Boolean(touched.code && errors.code)}
            helperText={touched.code && errors.code}
          />

          <Stack direction="row" alignItems="center">
            <Label> Mở ngay</Label>
            <Checkbox checked={openNow} onChange={handleOnTypeChange} onClick={handleOnTypeChange} />
          </Stack>

          <DatePickerInt label={'Thời gian mở'} value={timeOpen} setValue={setTimeOpen} openNow={openNow} />

          <TextField
            fullWidth
            type="number"
            label="Số ngày mở"
            {...getFieldProps('time_selling')}
            error={Boolean(touched.time_selling && errors.time_selling)}
            // helperText={touched.time_selling && errors.time_selling}
          />

          <TextField
            fullWidth
            type="number"
            label="Số lượng sản phẩm tối đa"
            {...getFieldProps('max_quantity_product')}
            error={Boolean(touched.max_quantity_product && errors.max_quantity_product)}
            helperText={touched.max_quantity_product && errors.max_quantity_product}
          />
          <Stack direction="row" alignItems="center" spacing={5}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Đăng ký gian hàng
            </LoadingButton>
            <LoadingButton fullWidth size="large" variant="contained" onClick={onCancelCreateTerminal}>
              Hủy
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
