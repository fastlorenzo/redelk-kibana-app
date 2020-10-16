import {combineReducers} from 'redux';
import {configReducer} from "./config/configReducer";
import {rtopsReducer} from "./rtops/rtopsReducer";

const rootReducer = combineReducers({
  config: configReducer,
  rtops: rtopsReducer,
});

export default rootReducer;
