"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const counterSlice = toolkit_1.createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
        increment: (state, action) => {
            return state + 1;
        },
        decrement: (state, action) => {
            return state - 1;
        },
        setCounter: (state, action) => {
            return action.payload;
        }
    }
});
exports.default = counterSlice;
