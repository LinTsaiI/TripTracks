import { createSlice } from '@reduxjs/toolkit';

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    tripData: null,   // 回傳對應行程名稱的細節
  },
  reducers: {
    updateTripData: (state, actions) => {
      let data = actions.payload.tripData;
      state.tripData = data;
    }
  }
});

export const { updateTripData } = tripSlice.actions;
export default tripSlice.reducer;


// Trip 中的 tripData 要視 params 動態由 getTripData() 取得，是否可以集中在 store 管理？