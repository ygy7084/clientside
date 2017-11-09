import { combineReducers } from 'redux';

import { reducer as loginReducer } from './login/reducer';

export const reducer = combineReducers({
  login: loginReducer,
});
