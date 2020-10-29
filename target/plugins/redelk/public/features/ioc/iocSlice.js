"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIOC = exports.fetchAllIOC = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const types_1 = require("../../types");
const initialState = {
    status: types_1.KbnCallStatus.idle,
    error: null,
    rtops: undefined
};
exports.fetchAllIOC = toolkit_1.createAsyncThunk('ioc/fetchAllIOC', async ({ http }) => {
    await new Promise(done => setTimeout(() => done(), 3000));
    const response = await http.get('/api/redelk/ioc');
    return response.response;
});
exports.createIOC = toolkit_1.createAsyncThunk('ioc/createIOC', async ({ http, payload }) => {
    const response = await http.post('/api/redelk/ioc', { body: JSON.stringify(payload) });
    return response.response;
});
const iocSlice = toolkit_1.createSlice({
    name: 'ioc',
    initialState: initialState,
    reducers: {
        setIOC: (state, action) => {
            state.ioc = action.payload;
        }
    },
    extraReducers: builder => {
        // Fetch all IOCs
        builder.addCase(exports.fetchAllIOC.pending, (state, action) => {
            state.status = types_1.KbnCallStatus.pending;
            state.error = '';
        });
        builder.addCase(exports.fetchAllIOC.fulfilled, (state, action) => {
            state.status = types_1.KbnCallStatus.success;
            state.error = '';
            state.rtops = action.payload;
        });
        builder.addCase(exports.fetchAllIOC.rejected, (state, action) => {
            state.status = types_1.KbnCallStatus.failure;
            state.error = action.error.message;
        });
        // Create IOC
        builder.addCase(exports.createIOC.pending, (state, action) => {
            state.status = types_1.KbnCallStatus.pending;
            state.error = '';
        });
        builder.addCase(exports.createIOC.fulfilled, (state, action) => {
            state.status = types_1.KbnCallStatus.success;
            state.error = '';
            // state.ioc = action.payload;
        });
        builder.addCase(exports.createIOC.rejected, (state, action) => {
            state.status = types_1.KbnCallStatus.failure;
            state.error = action.error.message;
            console.log('Error creating IOC:', action);
        });
    }
});
exports.default = iocSlice;
