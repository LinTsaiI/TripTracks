import { createSlice } from '@reduxjs/toolkit';
import { getNotes } from '../../API';

export const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    isOpen: false,
    currentFocus: null,   // 紀錄目前點擊的是誰
    notesName: '',
    content: ''
  },
  reducers: {
    switchNotes: (state, actions) => {
      let target = actions.payload.id;
      if (state.currentFocus == null || target == state.currentFocus) {
        state.currentFocus = target;
        state.isOpen = !(state.isOpen);
      } else {
        state.currentFocus = target;
        state.isOpen = true;
      }
    },
    hideNotes: (state) => {
      state.currentFocus = null;
      state.isOpen = false;
    },
    showNotesContent: (state, actions) => {
      let tripName = actions.payload.tripName;
      let day = actions.payload.day;
      if (!day) {
        day = 0;
      } else {
         day = day - 1;
      }
      let id = actions.payload.id;
      let result = getNotes(tripName, day, id);
      state.notesName = result[0];
      state.content = result[1];
    },
  }
});

export const { switchNotes, hideNotes, showNotesContent } = noteSlice.actions;
export default noteSlice.reducer;