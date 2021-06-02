import { combineReducers } from 'redux';
import alertReducer from './reducers/alert/alert.reducer';

export default combineReducers({
    alert: alertReducer
});
