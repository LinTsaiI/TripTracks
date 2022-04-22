import { createSlice } from '@reduxjs/toolkit';
import { getTripData, deleteSelectedPin } from '../../API';

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    tripData: null,
  },
  reducers: {
    updateTripData: (state, actions) => {
      let tripName = actions.payload.tripName;
      let data = getTripData(tripName);
      state.tripData = data;
    },
    deletePin: (state, actions) => {
      let tripName = actions.payload.tripName;
      let day = actions.payload.day;
      if (!day) {
        day = 0;
      } else {
         day = day - 1;
      }
      let id = actions.payload.id;
      let result = deleteSelectedPin(tripName, day, id);
      // 若刪除成功，更新行程資料。此處先以刪除後回傳的新tripData替代
      // if (result) {
      //   let data = getTripData(tripName);
      //   state.tripData = data;
      // }
      state.tripData.dayTrack[day].pinList = result;
    }
  }
});

export const { updateTripData, deletePin } = tripSlice.actions;
export default tripSlice.reducer;


// Trip 中的 tripData 要視 params 動態由 getTripData() 取得，是否可以集中在 store 管理？