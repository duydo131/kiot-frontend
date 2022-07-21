import * as Types from '../constants/ActionType';

const initialState = {
    isChange: true
}

const changeAvatar = (state = initialState, action={}) => {
    switch (action.type) {
        case Types.CHANGE_AVATAR:
            return {
                isChange: true
            }
        default: return state;
    }
}

export default changeAvatar;