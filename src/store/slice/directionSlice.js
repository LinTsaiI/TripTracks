import { createSlice } from '@reduxjs/toolkit';
import { getDirection } from '../../API';

export const directionSlice = createSlice({
  name: 'direction',
  initialState: {
    isOpen: false,
    currentFocus: null,   // 紀錄目前點擊的是誰
    start: '',
    end: '',
    directionInfo: ''
  },
  reducers: {
    switchDirection: (state, actions) => {
      let target = actions.payload.id;
      if (state.currentFocus == null || target == state.currentFocus) {
        state.currentFocus = target;
        state.isOpen = !(state.isOpen);
      } else {
        state.currentFocus = target;
        state.isOpen = true;
      }
    },
    hideDirection: (state) => {
      state.currentFocus = null;
      state.isOpen = false;
    },
    showDirectionInfo: (state, actions) => {
      let tripName = actions.payload.tripName;
      let day = actions.payload.day;
      if (!day) {
        day = 0;
      } else {
         day = day - 1;
      }
      let id = actions.payload.id;
      let result = getDirectionHistory(tripName, day, id);
      state.directionInfo = result;
    },
    getDirectionChoice: (state, actions) => {
      // 負責 call google direction api
      let start = actions.payload.start;
      let end = actions.payload.end;
      let latA = actions.payload.latA;
      let longA = actions.payload.longA;
      let latB = actions.payload.latB;
      let longB = actions.payload.longB;
      let result = getDirection(latA, longA, latB, longB);
      state.start = start;
      state.end = end;
      state.directionInfo = result;
    }
  }
});

export const { switchDirection, hideDirection, showDirectionInfo, getDirectionChoice } = directionSlice.actions;
export default directionSlice.reducer;