import { combineReducers } from 'redux';
import { reducer as accountReducer } from './account/reducer';
import { reducer as shopReducer } from './shop/reducer';
import { reducer as pictureReducer } from './picture/reducer';
import { reducer as productReducer } from './product/reducer';
import { reducer as customerReducer } from './customer/reducer';
import { reducer as orderReducer } from './order/reducer';
import { reducer as logReducer } from './log/reducer';
import { reducer as nfcReducer } from './nfc/reducer';
import { reducer as placeReducer } from './place/reducer';

export const reducer = combineReducers({
  account: accountReducer,
  shop: shopReducer,
  picture: pictureReducer,
  product: productReducer,
  customer: customerReducer,
  order: orderReducer,
  log: logReducer,
  nfc: nfcReducer,
  place: placeReducer,
});
