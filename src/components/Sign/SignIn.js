import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../store/slice/userSlice';

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
    <form className='sign-form' onSubmit={(e) => handelSignIn(e)}>
      <input type='text' placeholder='Username' ref={username}/><br/>
      <input type='password' placeholder='Password' ref={password}/><br/>
      <input type='submit' value='Sign In' />
    </form>
  )
}

export default SignIn;