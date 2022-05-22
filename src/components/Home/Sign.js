import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../store/slice/userSlice';
import { googleSignIn } from '../../API';
import googleIcon from '../../img/icons_google.png';

const Sign = ({ isSignModalOpen, setIsSignModalOpen }) => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isSignModalOpen) {
      setUserName('');
      setEmail('');
      setPassword('');
    }
  }, [isSignModalOpen]);

  const handelSignIn = (e) => {
    e.preventDefault();
    setIsSignModalOpen(false);
    console.log(username, email, password)
    // dispatch(signIn({
    //   username: username,
    //   email: email,
    //   password: password
    // }));
  }

  return(
    <div className='sign-container'>
      <div className='sign-title'>Sign in to TripTracks</div>
      <div onClick={() => setIsSignModalOpen(false)} className='close-btn'>&#215;</div>
      <form className='sign-form' onSubmit={handelSignIn}>
        <input type='text' placeholder='Username' onChange={e => setUserName(e.target.value)}/><br/>
        <input type='email' placeholder='Email' onChange={e => setEmail(e.target.value)}/><br/>
        <input type='password' placeholder='Password' onChange={e => setPassword(e.target.value)}/><br/>
        <input type='submit' value='Sign In'/>
      </form>
      <div className='sign-separate-line'>
        <div className='straight-line'></div>
        <div>or</div>
        <div className='straight-line'></div>
      </div>
      <div className='google-auth' onClick={() => {
        setIsSignModalOpen(false);
        googleSignIn();
      }}>
        <img src={googleIcon}/>
        Sign In with Google
      </div>
    </div>
  )
}

export default Sign;