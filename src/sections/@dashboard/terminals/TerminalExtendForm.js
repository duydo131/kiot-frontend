import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import { Stack, TextField, Checkbox, Typography } from '@mui/material';
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

function formatDay(value) {
  let d = new Date(value);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}

export default function TerminalCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const infoPayment = (handlerId, amount, type, payload) => dispatch(actPayment(handlerId, amount, type, payload));

  const [terminalId, setTerminalId] = useState(null);
  const [terminal, setTerminal] = useState(null);

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
    time_selling: Yup.number().notRequired(),
    max_quantity_product: Yup.number().notRequired(),
  });

  const extend = async (values) => {
    var payload = {
      terminal_id: terminal.id,
    };
    if (values['time_selling'] > 0) payload.extend_time_selling = values['time_selling'];
    if (values['max_quantity_product'] > 0) payload.extend_max_quantity_product = values['max_quantity_product'];
    return await callApiHttp({
      url: '/terminals/extend',
      method: 'POST',
      data: payload,
    });
  };

  const validate = (values) => {
    const extend_time_selling = values['time_selling'];
    const extend_max_quantity_product = values['max_quantity_product'];
    if (extend_time_selling <= 0 && extend_max_quantity_product <= 0) {
      toast('Chưa nhập thông tin gia hạn gian hàng');
      setLoading(false);
      return false;
    }
    if (extend_max_quantity_product > 0 && extend_max_quantity_product < terminal.max_quantity_product) {
      toast('Số sản phẩm tối đã của gian hàng không được bé hơn giá trị cũ');
      setLoading(false);
      return false;
    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      time_selling: 0,
      max_quantity_product: 0,
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const isValid = validate(values);
      if (!isValid) return;

      Promise.all([extend(values)])
        .then((res) => {
          const { data } = res[0]?.data;
          infoPayment(data.terminal.id, data.total_price, 'EXTEND_TERMINAL', {});
          navigate('/payment', { replace: true });
        })
        .catch((e) => {
          console.log('e', e);
          let err = e?.response?.data?.data;
          let errText = 'Gia hạn thất bại';
          if (typeof err === 'object') {
            errText = '';
            for (let key in err) {
              errText += `${key} : ${err[key]} \n`;
            }
          }
          toast(errText);
          setLoading(false);
          navigate('/dashboard/terminals/extend', { replace: true });
        });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const [loading, setLoading] = useState(isSubmitting);
  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  const onCancelExtendTerminal = () => {
    navigate(`/dashboard/terminals/${terminalId}`, { replace: true });
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}  mt={5}>
          <Stack direction="row" alignItems="center">
            <Typography component="h4" ml={3} width={200}>
              Tên gian hàng
            </Typography>
            <Typography component="h4" ml={3} width={500}>
              {terminal?.name}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography component="h4" ml={3} width={200}>
              Ngày hết hạn đăng ký
            </Typography>
            <Typography component="h4" ml={3} width={500}>
              {formatDay(terminal?.expired_at)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography component="h4" ml={3} width={200}>
              Số sản phẩm tối đa
            </Typography>
            <Typography component="h4" ml={3} width={500}>
              {terminal?.max_quantity_product}
            </Typography>
          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Số ngày mở thêm"
            {...getFieldProps('time_selling')}
            error={Boolean(touched.time_selling && errors.time_selling)}
            helperText={touched.time_selling && errors.time_selling}
          />

          <TextField
            fullWidth
            type="number"
            label="Số lượng sản phẩm tối đa mới"
            {...getFieldProps('max_quantity_product')}
            error={Boolean(touched.max_quantity_product && errors.max_quantity_product)}
            helperText={touched.max_quantity_product && errors.max_quantity_product}
          />
          <Stack direction="row" alignItems="center" spacing={5}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Gia hạn gian hàng
            </LoadingButton>
            <LoadingButton fullWidth size="large" variant="contained" onClick={onCancelExtendTerminal}>
              Hủy
            </LoadingButton>
          </Stack>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
