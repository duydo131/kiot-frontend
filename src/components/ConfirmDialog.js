import { makeStyles } from '@material-ui/core/styles';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const useStyles = makeStyles(() => ({
  dialog: {
    height: '30%',
    width: '30%',
  },
}));

const ConfirmDialog = ({ open, setOpen, message, handleConfirm }) => {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>Xác nhận!!</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleConfirm}>
          Đồng ý
        </LoadingButton>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleClose}>
          Hủy
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
