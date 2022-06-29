import { createStore } from 'redux'

import appReducers from './reducer/index'

const store = createStore(
    appReducers
);

export default store;