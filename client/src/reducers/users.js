import { USER_LOGIN, USER_LOGOUT } from '../actions';

export default function(state = {}, action) {
    switch (action.type) {
        case USER_LOGIN:
            if (action.error) {
                return { error: action.payload.request.response };
            }
            return { user: action.payload.data };
        case USER_LOGOUT: 
            return {
                user: null
            }
        default: 
            return state;
    }
}