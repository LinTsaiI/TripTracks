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
    isCreating: false,
    isNewTrip: false
  },
  reducers: {
    resetNewTrip: (state) => {
      state.isNewTrip = false;
      console.log(state.isNewTrip)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(asyncCreateNewTrip.pending, (state, action) => {
        console.log('create new trip pending');
        state.isCreating = true;
      })
      .addCase(asyncCreateNewTrip.fulfilled, (state, action) => {
        console.log('create new trip success');
        state.newtTripId = action.payload;
        state.isCreating = false;
        state.isNewTrip = true;
      });
  }
});

export const { resetNewTrip } = newTripSlice.actions;
export default newTripSlice.reducer;