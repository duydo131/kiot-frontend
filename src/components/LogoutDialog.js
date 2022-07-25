import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';


import { actLogout } from './../actions/index';

const useStyles = makeStyles(() => ({
  dialog: {
    height: '28%',
    width: '30%',
  },
}));

const LogoutDialog = ({ open, setOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const logout = () => dispatch(actLogout());

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>Xác nhận!!</DialogTitle>
      <DialogContent>Bạn có muốn đăng xuất không?</DialogContent>
      <DialogActions>
        <LoadingButton fullWidth size="large" variant="contained" onClick={() => logout()}>
          Đồng ý
        </LoadingButton>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleClose}>
          Hủy
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
