import { combineReducers } from 'redux';

import { poolsReducer, paginationReducer } from './pools';
import UserReducer from './users'

const rootReducer = combineReducers({
  pools: poolsReducer,
  poolsFilter: paginationReducer,
  user: UserReducer
});

export default rootReducer;