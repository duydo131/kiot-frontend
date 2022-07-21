import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { parse, isDate } from 'date-fns';

// material
import { Stack, TextField, Checkbox, InputAdornment, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/Iconify';

// component
import callApiHttp from '../../../utils/api';
import { actEnableToast, actPayment } from '../../../actions/index';
import Label from 'src/components/Label';
import Combobox from 'src/components/Combobox';

// ----------------------------------------------------------------------

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue // this make sure that a value is provided
    : parse(originalValue, 'dd-MM-yyyy', new Date());

  return parsedDate;
}

const genders = [
  {
    id: 1,
    title: 'Chưa rõ',
    value: 'UNKNOWN',
  },
  {
    id: 2,
    title: 'Nam',
    value: 'MALE',
  },
  {
    id: 3,
    title: 'Nữ',
    value: 'FEMALE',
  },
];

export default function TerminalCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [gender, setGender] = useState();

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Password is required'),
    repassword: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Password is required'),
  });

  const register = async (values) => {
    var payload = {
      username: values['username'],
      email: values['email'],
      password: values['password'],
      role: 'MANAGER',
      gender: gender,
    };
    return await callApiHttp({
      url: '/users/register',
      method: 'POST',
      data: payload,
    });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      repassword: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      Promise.all([register(values)])
        .then((data) => {
          toast('Đăng ký thành công');
          navigate('/login', { replace: true });
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
          setLoading(false);
          toast(errText);
        });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleReShowPassword = () => {
    setReShowPassword((show) => !show);
  };

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
            autoComplete="username"
            type="text"
            label="Tên tài khoản"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="email"
            type="text"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Combobox label={'Giới tính'} items={genders} value={gender} setValue={setGender} />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Mật khẩu"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Nhập lại mật khẩu"
            {...getFieldProps('repassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.repassword && errors.repassword)}
            helperText={touched.repassword && errors.repassword}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Đăng Ký
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
