import axios from 'axios';

export const FETCH_POOLS = 'fetch_pools';
export const FETCH_POOL = 'fetch_pool';
export const CREATE_POOL = 'crate_pool';
export const DELETE_POOL = 'delete_pool';
export const ADD_OPTION = 'add_option';
export const POOLS_FILTER = 'pools_filter';
export const VOTE = 'vote';
export const USER_LOGIN = 'user_login';
export const USER_LOGOUT = 'user_logout';
export const USER_SIGNUP = 'user_signup';


const ROOT_URL = process.env.REACT_APP_API_URL;

export function fetchPools(page = '', items = '', user = '') {
    const request = axios.get(`${ROOT_URL}pools?page=${page}&items=${items}&user=${user}`);
    return {
        type: FETCH_POOLS,
        payload: request
    };
}

export function fetchPool(id) {
    const request = axios.get(`${ROOT_URL}pool/${id}`);
    return {
        type: FETCH_POOL,
        payload: request
    };
}

export function createPool(pool, token, callback) {
    const request = axios.post(`${ROOT_URL}create`, { pool: pool.pool, options: pool.options }, { headers: { Authorization : `JWT ${token}` } }).then((res) => callback(res));
    return {
        type: CREATE_POOL,
        payload: request
    };
}

export function deletePool(poolId, token, callback) {
    axios.delete(`${ROOT_URL}pool/${poolId}`, { headers: { Authorization : `JWT ${token}` } }).then((res) => callback(res));
    return {
        type: DELETE_POOL,
        payload: poolId
    }
}

export function addOption(poolId, option, callback) {
    const request = axios.post(`${ROOT_URL}pool/${poolId}/add`, { option }).then(res => callback(res));
    return {
        type: ADD_OPTION,
        payload: request
    }
}

export function vote(poolId, optionId, callback) {
    const request = axios.get(`${ROOT_URL}vote?pool=${poolId}&option=${optionId}`);
    return {
        type: VOTE,
        payload: request
    };
}

export function loginUser(email, pass, user) {
    if (user) {
        return {
            type: USER_LOGIN,
            payload: {
                data: user
            }
        }
    }
    const request = axios.post(`${ROOT_URL}login`, {
        email,
        password: pass
    });
    return {
        type: USER_LOGIN,
        payload: request
    };
}

export function logoutUser() {
    return {
        type: USER_LOGOUT
    }
}

export function userSignUp(email, pass) {
    const request = axios.post(`${ROOT_URL}signup`, {
        email,
        password: pass
    });
    return {
        type: USER_SIGNUP,
        payload: request
    }
}

export function setPoolsFilter(filter, page) {
    return {
        type: POOLS_FILTER,
        filter: filter,
        page: page
    }
}