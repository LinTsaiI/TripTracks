import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTripList, createNewTrip, deleteSelectPlan } from '../../API';

export const asyncFetchTripList = createAsyncThunk('dashboard/asyncFetchTripList', async (userId) => {
  const tripList = await getTripList(userId);
  return tripList;
});

export const asyncCreateNewTrip = createAsyncThunk('dashboard/asyncCreateNewTrip', async (newTrip) => {
  const tripId = await createNewTrip(newTrip);
  return tripId;
});

export const asyncDeleteTrip = createAsyncThunk('dashboard/asyncDeleteTrip', async (tripInfo) => {
  const newTripList = await deleteSelectPlan(tripInfo);
  return newTripList;
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tripList: [],
    newtTripId: null,
    isProcessing: false,
    isNewTrip: false
  },
  reducers: {
    resetNewTrip: (state) => {
      state.isNewTrip = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(asyncFetchTripList.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncFetchTripList.fulfilled, (state, action) => {
        state.tripList = action.payload;
        state.isProcessing = false;
      })
      .addCase(asyncCreateNewTrip.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncCreateNewTrip.fulfilled, (state, action) => {
        state.newtTripId = action.payload;
        state.isProcessing = false;
        state.isNewTrip = true;
      })
      .addCase(asyncDeleteTrip.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncDeleteTrip.fulfilled, (state, action) => {
        state.tripList = action.payload;
        state.isProcessing = false;
      });
  }
});

export const { resetNewTrip } = dashboardSlice.actions;
export default dashboardSlice.reducer;