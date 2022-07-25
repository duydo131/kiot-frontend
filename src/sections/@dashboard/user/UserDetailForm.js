import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

// material
import {
  Stack,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import Image from '../../../components/Image';
import callApiHttp from '../../../utils/api';
import { actEnableToast, actChangeAvatar } from '../../../actions/index';
import LoadImage from '../../../components/LoadImage';
import Combobox from 'src/components/Combobox';
import { height, width } from '@mui/system';

// ----------------------------------------------------------------------

const formatDate = (value) => {
  let d = new Date(value);
  return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
};

const genderToName = (gender) => {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    default:
      return 'Chưa rõ';
  }
};

const roleToName = (role) => {
  switch (role) {
    case 'MANAGER':
      return 'người bán';
    case 'USER':
      return 'người mua hàng';
    case 'ADMIN':
      return 'người quản lý';
    default:
      return 'chưa rõ';
  }
};

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

const useStyles = makeStyles(() => ({
  dialog: {
    height: '60%',
    width: '40%',
  },
}));

function ChangePasswordDialog({ open, setOpen }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));

  const RegisterSchema = Yup.object().shape({
    password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Password is required'),
    newPassword: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('newPassword is required'),
    reNewPassword: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('reNewPassword is required'),
  });

  const changePassword = async (values) => {
    var payload = {
      password: values['password'],
      new_password: values['newPassword'],
    };
    return await callApiHttp({
      url: '/users/change-password',
      method: 'POST',
      data: payload,
    });
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      reNewPassword: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const newPassword = values['newPassword'];
      const reNewPassword = values['reNewPassword'];
      if (newPassword !== reNewPassword) {
        toast('Mật khẩu mới khống giống nhau');
        setLoading(false);
        return;
      }
      setLoading(true);
      Promise.all([changePassword(values)])
        .then((data) => {
          toast('Thay đổi mật khẩu thành công');
          handleClose();
        })
        .catch((e) => {
          console.log('e', e);
          let err = e?.response?.data?.data;
          let errText = 'Thay đổi mật khẩu thất bại';
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

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setShowPassword(false);
    setShowNewPassword(false);
  };

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(isSubmitting);
  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  return (
    <Dialog onClose={handleClose} open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>Thay đổi mật khẩu</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu cũ"
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
                autoComplete="current-password"
                type={showNewPassword ? 'text' : 'password'}
                label="Mật khẩu mới"
                {...getFieldProps('newPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowNewPassword} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showNewPassword ? 'text' : 'password'}
                label="Nhập lại mật khẩu mới"
                {...getFieldProps('reNewPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowNewPassword} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.reNewPassword && errors.reNewPassword)}
                helperText={touched.reNewPassword && errors.reNewPassword}
              />
            </Stack>
          </Form>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <LoadingButton fullWidth size="large" variant="contained" loading={loading} onClick={handleSubmit}>
          Thay đổi
        </LoadingButton>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleClose}>
          Hủy
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

const months = [
  {
    id: 1,
    title: '1 tháng',
    value: '1',
  },
  {
    id: 2,
    title: '3 tháng',
    value: '3',
  },
  {
    id: 3,
    title: '6 tháng',
    value: '6',
  },
  {
    id: 4,
    title: '12 tháng',
    value: '12',
  },
  {
    id: 5,
    title: 'Tất cả',
    value: 'all',
  },
];

const parseMonthToParam = (value) => {
  if (value === 'all' || value === '') {
    return {
      type: 'all',
      value: 0,
    };
  }
  return {
    type: 'month',
    value: parseInt(value),
  };
};

export default function UserDetailForm({ id, setRole, setLink , setCheckIsMe}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = (message) => dispatch(actEnableToast(message));
  const changeAvatar = () => dispatch(actChangeAvatar());
  const [selectedFile, setSelectedFile] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [user, setUser] = useState();
  const [newUser, setNewUser] = useState({
    name: '',
    address: '',
    gender: '',
  });
  const [gender, setGender] = useState();
  const [isMe, setIsMe] = useState(false);
  const [roleCode, setRoleCode] = useState('');

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState('1');

  const fetchUserDetail = async (id) => {
    return await callApiHttp({
      url: `/users/${id}`,
      method: 'GET',
      params: parseMonthToParam(month)
    });
  };

  const fetchCurrentUserDetail = async () => {
    return await callApiHttp({
      url: `/users/me`,
      method: 'GET',
    });
  };

  useEffect(() => {
    Promise.all([fetchUserDetail(id), fetchCurrentUserDetail()])
      .then((res) => {
        const { data } = res[0]?.data;
        setUser(data);
        setNewUser({
          name: data?.name,
          address: data?.address,
        });
        setGender(data?.gender);
        setRole(roleToName(data?.role));
        setRoleCode(data?.role);
        setLink(data?.role === 'USER' ? 'users' : 'sellers');

        const c_user = res[1]?.data?.data;

        // setIsMe(c_user.id === data.id);
        const is_me = c_user.id === data.id
        setIsMe(is_me)
        setCheckIsMe(is_me)
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
  }, [id, fetch, month]);
  const changeImageUser = async () => {
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
        ...user,
        avatar_url: upload?.data?.filepath,
      };
      const res = await callApiHttp({
        url: `/users/${user.id}`,
        method: 'PATCH',
        data: payload,
      });
      const { data } = res?.data;
      setFetch((e) => !e);
      setIsEdit(false);
      setSelectedFile(undefined);
      changeAvatar();
    } catch (e) {
      console.log('e', e);
      let err = e?.response?.data?.data;
      let errText = 'Cập nhật ảnh người dùng thất bại';
      if (typeof err === 'object') {
        errText = '';
        for (let key in err) {
          errText += `${key} : ${err[key]} \n`;
        }
      }
      toast(errText);
    }
  };
  console.log("abccc")
  const handlerCancelUpdateUser = (isCancel) => {
    setNewUser({
      name: user?.name,
      address: user?.address,
    });
    setGender(user?.gender);
    isCancel ? setIsUpdate(false) : setIsUpdate((e) => !e);
  };

  const updateUser = async () => {
    return await callApiHttp({
      url: `/users/${id}`,
      method: 'PATCH',
      data: {
        ...user,
        ...newUser,
        gender,
      },
    });
  };

  const handleUpdateUser = () => {
    Promise.all([updateUser()])
      .then((res) => {
        toast('Cập nhật thành công');
        setIsUpdate((x) => !x);
        setFetch((x) => !x);
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
  };

  return (
    <Stack direction="row" spacing={5} alignItems="center" ml={-20}>
      <Stack spacing={2} alignItems="center">
        {isMe && isEdit && (
          <LoadImage selectedFile={selectedFile} setSelectedFile={setSelectedFile} style={{ marginRight: '5%' }} />
        )}
        {selectedFile === undefined && (
          <Image isProduct={false} link={user?.avatar_url} onClick={() => setIsEdit((e) => !e)} />
        )}
        {isMe && isEdit && (
          <Stack direction="row" alignItems="center">
            <Button variant="contained" style={{ marginRight: '5px' }} onClick={changeImageUser}>
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
      <Stack spacing={3} alignItems="center" ml={3}>
        {isMe && !isUpdate ? (
          <Stack direction="row" alignItems="center" spacing={5} ml={-40}>
            <Button variant="contained" onClick={() => handlerCancelUpdateUser(false)}>
              Thay đổi thông tin cá nhân
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Đổi mật khẩu
            </Button>
          </Stack>
        )
          :
          null}
        <br />

        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="h6" component="h4" ml={3} width={200} >
            Tên người dùng:
          </Typography>
          {isMe && isUpdate ? (
            <Stack direction="row" alignItems="center" width={500} ml={3}>
              <TextField
                size='small'
                fullWidth
                label="Tên người dùng"
                value={newUser.name}
                onChange={(e) => {
                  let p = { ...newUser };
                  p.name = e.target.value;
                  setNewUser(p);
                }}
              />
            </Stack>
          ) : (
            <Typography component="h4" ml={3} width={500}>
              {user?.name}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Địa chỉ:
          </Typography>
          {isMe && isUpdate ? (
            <Stack direction="row" alignItems="center" width={500} ml={3}>
              <TextField
                fullWidth
                size='small'
                label="Địa chỉ"
                value={newUser.address}
                onChange={(e) => {
                  let p = { ...newUser };
                  p.address = e.target.value;
                  setNewUser(p);
                }}
              />
            </Stack>
          ) : (
            <Typography component="h4" ml={3} width={500}>
              {user?.address || 'Chưa có'}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Email:
          </Typography>
          <Typography component="h4" ml={3} width={500}>
            {user?.email}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Giới tính:
          </Typography>
          {isMe && isUpdate ? (
            <Stack ml={3}>
              <Combobox
                label={'Giới tính'}
                items={genders}
                value={gender}
                setValue={setGender}
                sx={{ width: 300 }}
              />
            </Stack>
          ) : (
            <Typography component="h5" ml={3} width={500}>
              {genderToName(user?.gender)}
            </Typography>
          )}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Trạng thái:
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {user?.is_active ? 'Hoạt động' : 'Không hoạt động'}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Chức vụ:
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {roleToName(user?.role)}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Typography variant="h6" component="h4" ml={3} width={200}>
            Thời gian đăng ký tài khoản:
          </Typography>
          <Typography component="h5" ml={3} width={500}>
            {formatDate(user?.created_at)}
          </Typography>
        </Stack>

        {roleCode === 'MANAGER' && (
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h4" ml={3} width={200}>
              Số lượng gian hàng:
            </Typography>
            <Typography component="h5" ml={3} width={500}>
              {`${user?.total_terminal || 0} Gian hàng`}
            </Typography>
          </Stack>
        )}

        {roleCode === 'MANAGER' && (
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h4" ml={3} width={200}>
              Số lượng sản phẩm trong hệ thống:
            </Typography>
            <Typography component="h5" ml={3} width={500}>
              {`${user?.total_product || 0} Sản phẩm`}
            </Typography>
          </Stack>
        )}

        {roleCode === 'USER' && (
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h4" ml={3} width={200}>
              Số lượng đơn hàng:
            </Typography>
            <Typography component="h5" ml={3} width={500}>
              {`${user?.total_order || 0} đơn hàng`}
            </Typography>
          </Stack>
        )}

        {roleCode === 'USER' && (
          <Stack spacing={2} alignItems="center" ml={3}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6" component="h4" ml={3} width={200}>
                Tổng chi tiêu:
              </Typography>
              <Typography component="h5" ml={3} width={500}>
                {`${user?.total_money || 0} đồng`}
              </Typography>
            </Stack>
            <Combobox label={'Thời gian'} items={months} value={month} setValue={setMonth} />
          </Stack>
        )}

        {isMe && isUpdate && (
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button variant="contained" onClick={handleUpdateUser}>
              Cập nhật
            </Button>
            <Button variant="contained" onClick={() => handlerCancelUpdateUser(true)}>
              Hủy
            </Button>
          </Stack>
        )}
      </Stack>

      <ChangePasswordDialog open={open} setOpen={setOpen}></ChangePasswordDialog>
    </Stack>
  );
}
