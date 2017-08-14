import axios from 'axios';

export const FETCH_POOLS = 'fetch_pools';
export const FETCH_POOL = 'fetch_pool';
export const CREATE_POOL = 'crate_pool';
export const POOLS_FILTER = 'pools_filter';
export const VOTE = 'vote';
export const USER_LOGIN = 'user_login';
export const USER_LOGOUT = 'user_logout';


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

export function setPoolsFilter(filter, page) {
    return {
        type: POOLS_FILTER,
        filter: filter,
        page: page
    }
}

// export function createPost(values, callback) {
//     const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values).then(() => callback());
//     return {
//         type: CREATE_POST,
//         payload: request
//     }
// }

// export function fetchPost(id) {
//     const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);
//     return {
//         type: FETCH_POST,
//         payload: request
//     }
// }

// export function deletePost(id, callback) {
//     const request = axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`).then(() => callback());
//     return {
//         type: DELETE_POST,
//         payload: id
//     }
// }