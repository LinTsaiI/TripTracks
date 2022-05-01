import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../store/slice/userSlice';
import { googleSignIn } from '../../API';

const SignIn = () => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const username = useRef();
  const password = useRef();

  const handelSignIn = (e) => {
    e.preventDefault();
    dispatch(signIn({
      username: username.current.value,
      password: password.current.value
    }));
  }

  
  return(
    <div className='sign-in'>
      {/* <input type='text' placeholder='Username' ref={username}/><br/>
      <input type='password' placeholder='Password' ref={password}/><br/>
      <input type='submit' value='Sign In'/> */}
      <div className='sign-in-email' onClick={() => emailSignIn()}>Sign In with Email</div>
      <div className='google-auth' onClick={() => googleSignIn()}>Sign In with Google Account</div>
    </div>
  )
}

export default SignIn;