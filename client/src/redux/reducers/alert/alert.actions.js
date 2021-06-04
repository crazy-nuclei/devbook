import { alertActionTypes } from './alert.types';
import { v4 as uuid } from 'uuid';


export const setAlert = alert => dispatch => {
    const id = uuid();
    dispatch({
        type: alertActionTypes.SET_ALERT,
        payload: {
            ...alert,
            id
        }
    })
    setTimeout(() => {
        dispatch(removeAlert(id));
    }, 3000);
}

export const removeAlert = id => ({
    type: alertActionTypes.REMOVE_ALERT,
    payload: id,
})

