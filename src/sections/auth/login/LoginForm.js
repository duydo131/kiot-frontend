import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import callApiHttp from '../../../utils/api';
// action
import { actEnableToast, actLogin, actLoginAdmin } from '../../../actions/index';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const signin = () => dispatch(actLogin());
  const signinAdmin = () => dispatch(actLoginAdmin());

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const login = async (values) => {
    var payload = {
      username: values['username'],
      password: values['password'],
    };
    try {
      const res = await callApiHttp({
        url: '/users/login',
        method: 'POST',
        data: payload,
      });
      const { token, is_superuser, is_user } = res.data?.data;
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('isAdmin', JSON.stringify(is_superuser));
      is_superuser ? signinAdmin() : signin();

      if(is_user){
        window.location.href = 'http://localhost:3000/signin'
      }else{
        toast('Đăng nhập thành công!!');
        navigate('/dashboard/home', { replace: true })
      }

    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Đăng nhập thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      setLoading(false)
      toast(errText);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      Promise.all([login(values)]);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const [loading, setLoading] = useState(isSubmitting)
  useEffect(() => {
    setLoading(isSubmitting)
  }, [isSubmitting])

  const isLoggedIn = useSelector((state) => state.auth.login);
  const checkCurrentUser = async () => {
    try {
      const res = await callApiHttp({
        url: '/users/me',
        method: 'GET',
      });
      const { role } = res?.data?.data;
      if (role === 'MANAGER' || role === 'ADMIN') {
        navigate('/dashboard/home');
      }
    } catch (e) {}
  };

  useEffect(() => {
    if(isLoggedIn) checkCurrentUser()
  }, [isLoggedIn]);

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
            // error={Boolean(touched.email && errors.email)}
            // helperText={touched.email && errors.email}
          />

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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          /> */}

          {/* <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Đăng nhập
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
