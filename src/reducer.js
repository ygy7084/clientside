import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as entryReducer } from './scenes/Entry/reducer';
import { reducer as adminReducer } from './scenes/Admin/reducer';
import { reducer as dataReducer } from './data/reducer';

export default combineReducers({
  routing: routerReducer,
  data: dataReducer,
  entry: entryReducer,
  admin: adminReducer,
});
