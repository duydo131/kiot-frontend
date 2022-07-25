import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast';
import payment from './payment';
import changeInfo from './changeInfo';


const appReducers = combineReducers({
    auth,
    toast,
    payment,
    changeInfo
});

export default appReducers;