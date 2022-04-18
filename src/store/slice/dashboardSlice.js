import { createSlice } from '@reduxjs/toolkit';
import { getTripList } from '../../API';

export const dashBoardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tripList: getTripList(),   // 有行程=>list, 沒行程=>null
  },
  reducers: {
    updateTripList: (state, actions) => {
      
    }
  }
});

export const { updateTripList } = dashBoardSlice.actions;
export default dashBoardSlice.reducer;