import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createNewTrip } from '../../API';

export const asyncCreateNewTrip = createAsyncThunk('newTrip/asyncCreateNewTrip', async (newTrip) => {
  const tripId = await createNewTrip(newTrip);
  return tripId;
});

export const newTripSlice = createSlice({
  name: 'newTrip',
  initialState: {
    newtTripId: null,
    isCreatedSuccessfully: false
  },
  extraReducers: builder => {
    builder
      .addCase(asyncCreateNewTrip.pending, (state, action) => {
        console.log('create new trip pending');
        // state.status = 'loading'
      })
      .addCase(asyncCreateNewTrip.fulfilled, (state, action) => {
        console.log('create new trip success');
        state.newtTripId = action.payload;
        state.isCreatedSuccessfully = true;
      });
  }
});

export const { initTrackData, savePreviousTrackState } = newTripSlice.actions;
export default newTripSlice.reducer;