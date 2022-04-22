import { createSlice } from '@reduxjs/toolkit';
import { userSignIn, userSignUp } from '../../API';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isSignIn: window.localStorage.getItem('isSignIn'),
    isSignInForm: true,
    isSignUpForm: false,
    id: null,
    username: null,
    email: null
  },
  reducers: {
    signIn: (state, actions) => {
      let username = actions.payload.username;
      let password = actions.payload.password;
      let result = userSignIn(username, password);
      if (result) {
        window.localStorage.setItem('isSignIn', true);
        state.isSignIn = window.localStorage.getItem('isSignIn');
        state.username = username;
      }
    },
    signUp: (state, actions) => {
      let username = actions.payload.username;
      let email = actions.payload.email;
      let password = actions.payload.password;
      let result = userSignUp(username, email, password);
      if (result) {
        window.localStorage.setItem('isSignIn', true);
        state.isSignIn = window.localStorage.getItem('isSignIn');
        state.username = username;
        state.email = email;
      }
    },
    signOut: (state) => {
      window.localStorage.removeItem('isSignIn');
      state.isSignIn = window.localStorage.getItem('isSignIn');
    },
    switchToSignInForm: (state) => {
      state.isSignInForm = true;
      state.isSignUpForm = false;
    },
    switchToSignUpForm: (state) => {
      state.isSignUpForm = true;
      state.isSignInForm = false;
    }
  }
});

export const { signIn, signUp, signOut, switchToSignInForm, switchToSignUpForm } = userSlice.actions;
export default userSlice.reducer;