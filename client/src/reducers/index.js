import { combineReducers } from 'redux';

import { poolsReducer, paginationReducer } from './pools';
import UserReducer from './users'

const rootReducer = combineReducers({
  pools: poolsReducer,
  poolsFilter: paginationReducer,
  user: UserReducer
});

export default rootReducer;

// import { combineReducers } from 'redux';
// import { reducer as formReducer} from 'redux-form';
// import PostsReducer from './reducer_posts';

// const rootReducer = combineReducers({
//   posts: PostsReducer,
//   form: formReducer
// });

// export default rootReducer;