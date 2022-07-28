import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { actEnableToast } from '../../../actions/index';
import callApiHttp from '../../../utils/api';
// material
import { Stack, TextField, Typography } from '@mui/material';

import { LoadingButton } from '@mui/lab';

function numberWithCommas(x) {
  if (typeof x === 'undefined') return x;
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

function PaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const infoPayment = useSelector((state) => state.payment);

  const toast = (message) => dispatch(actEnableToast(message));

  async function SubmitFormSuccess(values) {
    var cardId = values['cardId'];
    var bank = values['bank'];
    if (cardId === '' || bank === '') {
      toast('Thiếu thông tin thanh toán');
      return;
    }
    var payload = {
      card_id: cardId,
      bank: bank,
      amount: infoPayment.amount,
      handler_id: infoPayment.handler_id,
      type: infoPayment.type,
    };
    try {
      const res = await callApiHttp({
        url: '/payments',
        method: 'POST',
        data: payload,
      });
      const { id } = res?.data?.data;

      console.log(id);
      const success = await callApiHttp({
        url: '/after-payment/success',
        method: 'POST',
        data: {
          id,
        },
      });
      toast('Thanh toán thành công!!!');
      // history.push('/')
      if (infoPayment.type === 'EXTEND_TERMINAL') {
        const id = localStorage.getItem('terminalId');
        navigate(`/dashboard/terminals/${id}`, { replace: true });
      } else {
        navigate('/dashboard/terminals', { replace: true });
      }
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Đặt hàng thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    }
  }

  async function handleCancelPayment() {
    try {
      const fail = await callApiHttp({
        url: '/after-payment/fail',
        method: 'POST',
        data: {
          handler_id: infoPayment.handler_id,
          transaction_type: infoPayment.type,
        },
      });
      console.log(fail);
      if (infoPayment.type === 'EXTEND_TERMINAL') {
        const id = localStorage.getItem('terminalId');
        navigate(`/dashboard/terminals/${id}`, { replace: true });
      } else {
        navigate('/dashboard/terminals', { replace: true });
      }
    } catch (e) {
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
    }
  }

  const PaymentSchema = Yup.object().shape({
    cardId: Yup.string().required('Username is required'),
    bank: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      cardId: '',
      bank: '',
    },
    validationSchema: PaymentSchema,
    onSubmit: (values) => {
      Promise.all([SubmitFormSuccess(values)]);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const [loading, setLoading] = useState(isSubmitting);
  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="cardId"
            type="text"
            label="Số tài khoản"
            {...getFieldProps('cardId')}
            error={Boolean(touched.cardId && errors.cardId)}
            helperText={touched.cardId && errors.cardId}
          />

          <TextField
            fullWidth
            autoComplete="bank"
            type="text"
            label="Ngân hàng"
            {...getFieldProps('bank')}
            error={Boolean(touched.bank && errors.bank)}
            helperText={touched.bank && errors.bank}
          />

          <Typography variant="h3" component="h4" ml={3} width={500}>
            {`Tổng Tiền:  ${numberWithCommas(infoPayment.amount)} đồng`}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={5} mt={3}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
          >
            Thanh toán
          </LoadingButton>
          <LoadingButton fullWidth size="large" variant="contained" onClick={handleCancelPayment}>
            Hủy
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

export default PaymentForm;
