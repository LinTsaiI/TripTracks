import { createSlice } from '@reduxjs/toolkit';
import { getTripData, deleteSelectedPin } from '../../API';

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    tripList: [],
    tripData: null,
    trackId: null,
    dayTrack: null,
    day: 1
  },
  reducers: {
    setTripList: (state, actions) => {
      let trips = actions.payload.tripList;
      state.tripList = trips;
    },
    setTripData: (state, actions) => {
      let tripData = actions.payload.tripData;
      state.tripData = tripData;
    },
    setDayTrack: (state, actions) => {
      let trackId = actions.payload.trackId;
      let dayTrack = actions.payload.dayTrack;
      state.trackId = trackId;
      state.dayTrack = dayTrack;
    },
    updateDayTrack: (state, actions) => {
      let dayTrack = actions.payload.dayTrack;
      state.dayTrack = dayTrack;
    },
    // 切換不同天的行程時，需將上一個行程的狀態 e.g. mapCenter 記錄下來並更新到資料庫
    savePreviousTrackState: (state, actions) => {
      console.log('save previous dayTrack state, target: ', state.trackId)
    },
  }
});

export const { setTripList, setTripData, setDayTrack, updateDayTrack, savePreviousTrackState, deletePin } = tripSlice.actions;
export default tripSlice.reducer;


// Trip 中的 tripData 要視 params 動態由 getTripData() 取得，是否可以集中在 store 管理？