import { createSlice } from '@reduxjs/toolkit';
import { createNewTripToDb } from '../../API';

export const newTripSlice = createSlice({
  name: 'newTrip',
  initialState: {
    isShow: false,
    createSuccessfully: false
  },
  reducers: {
    showModal: (state) => {
      state.isShow = true;
    },
    hideModal: (state) => {
      state.isShow = false;
      state.createSuccessfully = false;
    },
    createNewTrip: (state, actions) => {
      let tripName = actions.payload.tripName;
      let startDate = actions.payload.startDate;
      let duration = actions.payload.duration;
      // call API => 將 form 資料存到資料庫 => navigate(`/trip/${tripName}`)
      let result = createNewTripToDb(tripName, startDate, duration);
      if(result) {
        state.createSuccessfully = true;
      } else {
        console.log('行程加入失敗');
      }
    }
  }
});

export const { showModal, hideModal, createNewTrip } = newTripSlice.actions;
export default newTripSlice.reducer;