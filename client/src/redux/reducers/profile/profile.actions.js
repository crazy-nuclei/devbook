import axios from 'axios';
import { profileActionTypes } from './profile.types';
import { setAlert } from '../alert/alert.actions';

//Get current user's profile
export const getCurrentUserProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: profileActionTypes.GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: profileActionTypes.PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

