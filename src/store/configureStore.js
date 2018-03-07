

import {createStore, applyMiddleware} from 'redux';
import reducers from '../reducers/index';

export default () => {
    const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    return store;
}    

