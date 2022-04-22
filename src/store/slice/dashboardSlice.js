import { createSlice } from '@reduxjs/toolkit';
import { getTripList } from '../../API';

export const dashBoardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tripList: null,   // 有行程=>list, 沒行程=>null
  },
  reducers: {
    getTotalTrip: (state, actions) => {
      let memberId = actions.payload.memberId;
      let data = getTripList(memberId);
      state.tripList = data;
    },
    updateTripList: (state, actions) => {
      
    }
  }
});

export const { getTotalTrip, updateTripList } = dashBoardSlice.actions;
export default dashBoardSlice.reducer;