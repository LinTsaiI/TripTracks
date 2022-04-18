import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isSignIn: window.localStorage.getItem('isSignIn'),
    id: null,
    userName: null,
    email: null
  },
  reducers: {
    signIn: (state) => {
      window.localStorage.setItem('isSignIn', true);
      state.isSignIn = window.localStorage.getItem('isSignIn');
    },
    signOut: (state) => {
      window.localStorage.removeItem('isSignIn');
      state.isSignIn = window.localStorage.getItem('isSignIn');
    }
  }
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;