import {createSlice} from '@reduxjs/toolkit';

import {ConfigState} from './types';

const initialState: ConfigState = {
  showTopNav: false,
  currentRoute: null
}

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    setShowTopNav: (state, action) => {
      state.showTopNav = action.payload;
    },
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    }
  },
});

export default configSlice;
