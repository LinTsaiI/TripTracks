import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    username: null,
    email: null
  },
  reducers: {
    // signIn: (state, action) => {
    //   let username = action.payload.username;
    //   let password = action.payload.password;
    //   let result = userSignIn(username, password);
    //   if (result) {
    //     window.localStorage.setItem('isSignIn', true);
    //     state.isSignIn = window.localStorage.getItem('isSignIn');
    //     state.username = username;
    //   }
    // },
    // signUp: (state, action) => {
    //   let username = action.payload.username;
    //   let email = action.payload.email;
    //   let password = action.payload.password;
    //   let result = userSignUp(username, email, password);
    //   if (result) {
    //     window.localStorage.setItem('isSignIn', true);
    //     state.isSignIn = window.localStorage.getItem('isSignIn');
    //     state.username = username;
    //     state.email = email;
    //   }
    // },
    signOut: (state) => {
      window.localStorage.removeItem('isSignIn');
      state.isSignIn = window.localStorage.getItem('isSignIn');
    },
    setUser: (state, action) => {
      const { userId, username, email } = action.payload;
      state.userId = userId;
      state.username = username;
      state.email = email;
    }
  }
});

export const { signIn, signUp, signOut, setUser } = userSlice.actions;
export default userSlice.reducer;