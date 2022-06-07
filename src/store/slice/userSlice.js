import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getAvatarRef = createAsyncThunk('user/getAvatar', async (userId) => {
  const userSnap = await getDoc(doc(db, 'user', userId));
  return userSnap.data().avatar;
}); 

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    username: null,
    email: null,
    avatar: null
  },
  reducers: {
    setUser: (state, action) => {
      const { userId, username, email } = action.payload;
      state.userId = userId;
      state.username = username;
      state.email = email;
    },
    changeAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    changeName: (state, action) => {
      state.username = action.payload;
      const currentName = window.localStorage.getItem('username');
      if (currentName) {
        window.localStorage.setItem('username', action.payload);
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getAvatarRef.fulfilled, (state, action) => {
        state.avatar = action.payload;
      })
  }
});

export const { setUser, changeAvatar, changeName } = userSlice.actions;
export default userSlice.reducer;