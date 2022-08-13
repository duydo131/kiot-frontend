import * as Types from '../constants/ActionType';


export const actLogin = () => {
    return {
        type: Types.LOGIN,
    }
}

export const actLoginAdmin = () => {
    return {
        type: Types.LOGIN_ADMIN,
    }
}

export const actLogout = () => {
    return {
        type: Types.LOGOUT,
    }
}


export const actPayment = (handlerId, amount, type, payload) => {
    return {
        type: Types.PAYMENT,
        infoPayment: {
            'handler_id': handlerId,
            amount,
            type,
            payload
        }
    }
}

export const actEnableToast = (message) => {
    return {
        type: Types.ENABLE_TOAST,
        message: message,
    }
}

export const actDisableToast = () => {
    return {
        type: Types.DISABLE_TOAST,
    }
}

export const actChangeInfo = () => {
    return {
        type: Types.CHANGE_INFO,
    }
}