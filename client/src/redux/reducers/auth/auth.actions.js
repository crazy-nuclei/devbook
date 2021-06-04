import axios from 'axios';

import { authActionTypes } from './auth.types';
import { setAlert } from '../alert/alert.actions';
import setAuthToken from '../../../utils/setAuthToken';

// get the user
export const loadUser = () => async dispatch => {


    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');
        console.log(res);
        dispatch({
            type: authActionTypes.USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: authActionTypes.AUTH_ERROR,
        })
    }
}




// register a user
export const register = ({ name, email, password }) => async dispatch => {


    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify({ name, email, password });


    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: authActionTypes.REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert({ alertType: 'danger', msg: error.msg }));

            });
        }
        dispatch({
            type: authActionTypes.REGISTER_FAIL
        })

    }
}


// login user 

export const loginUser = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify({ email, password });


    try {
        const res = await axios.post('/api/auth', body, config);
        dispatch({
            type: authActionTypes.LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => {
                dispatch(setAlert({ alertType: 'danger', msg: error.msg }));

            });
        }
        dispatch({
            type: authActionTypes.LOGIN_FAIL,
        })
    }
}

export const logoutUser = () => dispatch => {
    dispatch({
        type: authActionTypes.LOGOUT
    })
}