import rtopsSlice from '../features/rtops/rtopsSlice';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  rtops: rtopsSlice.reducer
});

export default rootReducer;
