import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast';
import payment from './payment';
import changeAvatar from './changeAvatar';


const appReducers = combineReducers({
    auth,
    toast,
    payment,
    changeAvatar
});

export default appReducers;