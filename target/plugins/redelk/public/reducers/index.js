"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import currentUser from './currentUser'
const counterSlice_1 = tslib_1.__importDefault(require("../features/counter/counterSlice"));
const iocSlice_1 = tslib_1.__importDefault(require("../features/ioc/iocSlice"));
const redux_1 = require("redux");
const rootReducer = redux_1.combineReducers({
    //    currentUser,
    counter: counterSlice_1.default.reducer,
    rtops: iocSlice_1.default.reducer
});
exports.default = rootReducer;
