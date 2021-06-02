import { alertActionTypes } from './alert.types';

export const setAlert = alert => ({
    type: alertActionTypes.SET_ALERT,
    payload: alert
})


export const removeAlert = id => ({
    type: alertActionTypes.REMOVE_ALERT,
    payload: id,
})

