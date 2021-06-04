import { profileActionTypes } from './profile.types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case profileActionTypes.GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }

        case profileActionTypes.PROFILE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        default:
            return state;
    }
}

export default profileReducer;