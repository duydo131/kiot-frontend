import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast';
import payment from './payment';


const appReducers = combineReducers({
    auth,
    toast,
    payment
});

export default appReducers;