import * as Types from '../constants/ActionType';

const token = JSON.parse(localStorage.getItem('token'));
const initialState = token !== null;

const auth = (state = initialState, action={}) => {
    switch (action.type) {
        case Types.LOGOUT:
            localStorage.removeItem('token');
            return false
        case Types.LOGIN:
            return true
        default: return state;
    }
}

export default auth;