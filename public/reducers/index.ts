import rtopsSlice from '../features/rtops/rtopsSlice';
import {combineReducers} from 'redux';
import configSlice from "../features/config/configSlice";

const rootReducer = combineReducers({
  rtops: rtopsSlice.reducer,
  config: configSlice.reducer,
});

export default rootReducer;
