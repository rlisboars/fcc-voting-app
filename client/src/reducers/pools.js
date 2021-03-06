import _ from 'lodash';

import { FETCH_POOLS, FETCH_POOL, DELETE_POOL, POOLS_FILTER, VOTE } from '../actions';

export function poolsReducer(state = {}, action) {
    switch(action.type) {
        case FETCH_POOLS:
            return { 
                total: action.payload.data.total,
                pools: _.mapKeys(action.payload.data.pools, '_id') 
            };
        case FETCH_POOL:
            if (action.error) {
                return { error: 'Invalid Pool' } 
            }
            return { ...state, [action.payload.data._id]: action.payload.data };
        case DELETE_POOL:
            if (action.error) {
                return { error: 'Invalid Pool' }
            }
            const newState = _.omit(state.pools, action.payload);
            return  {
                total: Object.keys(newState).length,
                pools: newState
            }
        case VOTE:
            return { ...state, [action.payload.data._id]: action.payload.data};
        default:
            return state;
    }
}

export function paginationReducer(state = {}, action) {
    switch(action.type) {
        case POOLS_FILTER:
            return { 
                filter: action.filter, 
                page: action.page 
            };
        default:
            return state;
    }
}
