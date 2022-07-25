import * as Types from '../constants/ActionType';

const initialState = {
    isChange: true
}

const changeInfo = (state = initialState, action={}) => {
    switch (action.type) {
        case Types.CHANGE_INFO:
            return {
                isChange: true
            }
        default: return state;
    }
}

export default changeInfo;