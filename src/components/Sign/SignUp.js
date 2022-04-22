import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signUp } from '../../store/slice/userSlice';

const SignUp = () => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const username = useRef();
  const email = useRef();
  const password = useRef();

  const handelSignUp = (e) => {
    e.preventDefault();
    dispatch(signUp({
      username: username.current.value,
      email: email.current.value,
      password: password.current.value
    }));
  }


  return(
    <form className='sign-form' onSubmit={(e) => handelSignUp(e)}>
      <input type='text' placeholder='Username' ref={username}/><br/>
      <input type='email' placeholder='Email' ref={email}/><br/>
      <input type='password' placeholder='Password' ref={password}/><br/>
      <input type='submit' value='Sign Up'/>
    </form>
  );
}

export default SignUp;