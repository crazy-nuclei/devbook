import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './root-reducer';


const middlware = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middlware));

export default store;