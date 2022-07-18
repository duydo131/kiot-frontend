import * as Types from '../constants/ActionType';

const token = JSON.parse(localStorage.getItem('token'));
const isSuperUser = localStorage.getItem('isAdmin') === 'true';
const initialState = {
    login: token !== null,
    isSuperUser: isSuperUser
}

const auth = (state = initialState, action={}) => {
    switch (action.type) {
        case Types.LOGOUT:
            localStorage.removeItem('token');
            return {
                login: false,
                isSuperUser: false
            }
        case Types.LOGIN:
            return {
                login: true,
                isSuperUser: false
            }
        case Types.LOGIN_ADMIN:
            return {
                login: true,
                isSuperUser: true
            }
        default: return state;
    }
}

export default auth;