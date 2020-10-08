import {createSlice} from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state, action) => {
      return state + 1
    },
    decrement: (state, action) => {
      return state - 1
    },
    setCounter: (state, action) => {
      return action.payload
    }
  }
})

export default counterSlice;
