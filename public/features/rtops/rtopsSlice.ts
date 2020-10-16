import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EsAnswerRtops, KbnCallStatus} from '../../types'
import {CreateIOCType, RtopsState} from './types'

import {CoreStart} from 'kibana/public';

interface AsyncThunkArgs {
  http: CoreStart['http'];
  payload?: CreateIOCType;
}

const initialState: RtopsState = {
  status: KbnCallStatus.idle,
  error: null,
  rtops: undefined,
  showAddIOCForm: false,
  hiddenFilters: []
}

export const fetchAllIOC = createAsyncThunk(
  'rtops/fetchAllIOC',
  async ({http}: AsyncThunkArgs) => {
    await new Promise(done => setTimeout(() => done(), 3000));
    const response = await http.get('/api/redelk/ioc');
    return response.response
  }
)

export const createIOC = createAsyncThunk(
  'rtops/createIOC',
  async ({http, payload}: AsyncThunkArgs) => {
    const response = await http.post('/api/redelk/ioc', {body: JSON.stringify(payload)});
    return response.response
  }
)

export const fetchRtops = createAsyncThunk(
  'rtops/fetchRtops',
  async () => {

  }
);

const rtopsSlice = createSlice({
  name: 'rtops',
  initialState: initialState,
  reducers: {
    setIOC: (state, action) => {
      state.rtops = action.payload;
      state.status = KbnCallStatus.success;
    },
    setShowAddIOCForm: (state, action) => {
      state.rtops = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setHiddenFilters: (state, action) => {
      state.hiddenFilters = action.payload;
    }
  },
  extraReducers: builder => {
    // Fetch all IOCs
    builder.addCase(fetchAllIOC.pending, (state: RtopsState, action) => {
      state.status = KbnCallStatus.pending;
      state.error = '';
    });
    builder.addCase(fetchAllIOC.fulfilled, (state: RtopsState, action: PayloadAction<EsAnswerRtops>) => {
      state.status = KbnCallStatus.success;
      state.error = '';
      state.rtops = action.payload;
    });
    builder.addCase(fetchAllIOC.rejected, (state: RtopsState, action) => {
      state.status = KbnCallStatus.failure;
      state.error = action.error.message;
    });
    // Create IOC
    builder.addCase(createIOC.pending, (state: RtopsState, action) => {
      state.status = KbnCallStatus.pending;
      state.error = '';
    });
    builder.addCase(createIOC.fulfilled, (state: RtopsState, action) => {
      state.status = KbnCallStatus.success;
      state.error = '';
      // state.ioc = action.payload;
    });
    builder.addCase(createIOC.rejected, (state: RtopsState, action) => {
      state.status = KbnCallStatus.failure;
      state.error = action.error.message;
      console.log('Error creating IOC:', action);
    });
  }
});

export default rtopsSlice;
