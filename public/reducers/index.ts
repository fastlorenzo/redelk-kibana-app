// import currentUser from './currentUser'
import counterSlice from '../features/counter/counterSlice';
import iocSlice from '../features/ioc/iocSlice';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
//    currentUser,
  counter: counterSlice.reducer,
  ioc: iocSlice.reducer
});

export default rootReducer;
