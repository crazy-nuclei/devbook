import { authActionTypes } from './auth.types';

const inititalState = {
    user: null,
    loading: true,
    isAuthenticated: false,
    token: localStorage.getItem('token')
}


const authReducer = (state = inititalState, action) => {

    switch (action.type) {

        case authActionTypes.USER_LOADED: {
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        }
        case authActionTypes.REGISTER_SUCCESS:
        case authActionTypes.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                loading: false,
                isAuthenticated: true,
            }

        case authActionTypes.REGISTER_FAIL:
        case authActionTypes.AUTH_ERROR:
        case authActionTypes.LOGIN_FAIL:
        case authActionTypes.LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                token: null
            }

        default:
            return state;
    }
}


export default authReducer;