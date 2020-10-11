import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EsAnswerIOC, KbnCallStatus} from '../../types'
import {CreateIOCType, IOCState} from './types'

import {CoreStart} from 'kibana/public';

interface AsyncThunkArgs {
  http: CoreStart['http'];
  payload?: CreateIOCType;
}

const initialState: IOCState = {
  status: KbnCallStatus.idle,
  error: null,
  ioc: undefined
}

export const fetchAllIOC = createAsyncThunk(
  'ioc/fetchAllIOC',
  async ({http}: AsyncThunkArgs) => {
    await new Promise(done => setTimeout(() => done(), 3000));
    const response = await http.get('/api/redelk/ioc');
    return response.response
  }
)

export const createIOC = createAsyncThunk(
  'ioc/createIOC',
  async ({http, payload}: AsyncThunkArgs) => {
    const response = await http.post('/api/redelk/ioc', {body: JSON.stringify(payload)});
    return response.response
  }
)

const iocSlice = createSlice({
  name: 'ioc',
  initialState: initialState,
  reducers: {
    setIOC: (state, action) => {
      state.ioc = action.payload
    }
  },
  extraReducers: builder => {
    // Fetch all IOCs
    builder.addCase(fetchAllIOC.pending, (state: IOCState, action) => {
      state.status = KbnCallStatus.pending;
      state.error = '';
    });
    builder.addCase(fetchAllIOC.fulfilled, (state: IOCState, action: PayloadAction<EsAnswerIOC>) => {
      state.status = KbnCallStatus.success;
      state.error = '';
      state.ioc = action.payload;
    });
    builder.addCase(fetchAllIOC.rejected, (state: IOCState, action) => {
      state.status = KbnCallStatus.failure;
      state.error = action.error.message;
    });
    // Create IOC
    builder.addCase(createIOC.pending, (state: IOCState, action) => {
      state.status = KbnCallStatus.pending;
      state.error = '';
    });
    builder.addCase(createIOC.fulfilled, (state: IOCState, action) => {
      state.status = KbnCallStatus.success;
      state.error = '';
      // state.ioc = action.payload;
    });
    builder.addCase(createIOC.rejected, (state: IOCState, action) => {
      state.status = KbnCallStatus.failure;
      state.error = action.error.message;
      console.log('Error creating IOC:', action);
    });
  }
});

export default iocSlice;
