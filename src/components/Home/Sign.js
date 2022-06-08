import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, db, provider } from '../../firebase';
import { getDocs, query, collection, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { setUser } from '../../store/slice/userSlice';
import googleIcon from '../../img/icons_google.png';

const Sign = ({ isSignModalOpen, setIsSignModalOpen, setIsUserStateProcessing }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('testtest');
  const [alert, setAlert] = useState('');
  const signInFormClassName = isSignInForm ? 'sign-in-container' : 'display-none';
  const signUpFormClassName = isSignInForm ? 'display-none' : 'sign-up-container';

  useEffect(() => {
    setUserName('');
    // setEmail('');
    // setPassword('');
    setAlert('');
    setIsSignInForm(true);
  }, [isSignModalOpen]);

  const handelSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert('Please enter your email and password');
    } else {
      setIsUserStateProcessing(true);
      try {
        const condition = query(collection(db, 'user'), where('email', '==', email), where('password', '==', password));
        const querySnap = await getDocs(condition);
        if (querySnap.empty) {
          setIsUserStateProcessing(false);
          setAlert('Wrong Email or password. Please try again.');
        } else {
          const user = querySnap.docs[0];
          dispatch(setUser({
            userId: user.id,
            username: user.data().name,
            email: user.data().email,
          }));
          window.localStorage.setItem('userId', user.id);
          window.localStorage.setItem('username', user.data().name);
          window.localStorage.setItem('email', user.data().email);
          setIsUserStateProcessing(false);
          navigate('/dashboard');
        }
      } catch (err) {
        setIsUserStateProcessing(false);
        setAlert('Something went wrong. PLease try later.');
      }
    }  
  }

  const handelSignUp = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setIsUserStateProcessing(false);
      setAlert('Please enter your username, email and password');
    } else {
      setIsUserStateProcessing(true);
      try {
        const condition = query(collection(db, 'user'), where('email', '==', email), where('password', '==', password));
        const querySnap = await getDocs(condition);
        if (querySnap.empty) {
          const user = await addDoc(collection(db, 'user'), {
            name: username,
            email: email,
            password: password,
            tripId: [],
            FirstEntryTime: serverTimestamp(),
            avatar: 'default'
          });
          if (user.id) {
            dispatch(setUser({
              userId: user.id,
              username: username,
              email: email,
            }));
            window.localStorage.setItem('userId', user.id);
            window.localStorage.setItem('username', username);
            window.localStorage.setItem('email', email);
            setIsUserStateProcessing(false);
            navigate('/dashboard');
          }
        } else {
          setIsUserStateProcessing(false);
          setAlert('This email has already been registered');
        }
      } catch (err) {
        setIsUserStateProcessing(false);
        setAlert('Something went wrong. PLease try later.');
      }
    }
  }

  const switchForm = () => {
    setUserName('');
    // setEmail('');
    // setPassword('');
    setAlert('');
    setIsSignInForm(current => !current);
  }

  const googleAuth = () => {
    try {
      setIsSignModalOpen(false);
      signInWithPopup(auth, provider);
    } catch (err) {
      console.log('google sign in err', err);
    }
  }

  return(
    <div className='auth-container'>
      <div className={signInFormClassName}>
        <div className='auth-title'>Sign in to TripTracks</div>
        <div onClick={() => setIsSignModalOpen(false)} className='close-btn'>&#215;</div>
        <form className='auth-form' onSubmit={handelSignIn}>
          <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/><br/>
          <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/><br/>
          <input type='submit' value='Sign In'/>
        </form>
        <div className='auth-separate-line'>
          <div className='straight-line'></div>
          <div>or</div>
          <div className='straight-line'></div>
        </div>
        <div className='google-auth' onClick={googleAuth}>
          <img src={googleIcon}/>
          Sign In with Google
        </div>
        <div className='alert'>{alert}</div>
        <div className='switch-form' onClick={switchForm}>Don't have an account yet?<span>Sign up</span></div>
      </div>
      <div className={signUpFormClassName}>
        <div className='auth-title'>Sign up to TripTracks</div>
        <div onClick={() => setIsSignModalOpen(false)} className='close-btn'>&#215;</div>
        <form className='auth-form' onSubmit={handelSignUp}>
          <input type='text' placeholder='Username' value={username} onChange={e => setUserName(e.target.value)}/><br/>
          <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/><br/>
          <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/><br/>
          <input type='submit' value='Sign Up'/>
        </form>
        <div className='auth-separate-line'>
          <div className='straight-line'></div>
          <div>or</div>
          <div className='straight-line'></div>
        </div>
        <div className='google-auth' onClick={googleAuth}>
          <img src={googleIcon}/>
          Sign Up with Google
        </div>
        <div className='alert'>{alert}</div>
        <div className='switch-form' onClick={switchForm}>Already have an account?<span>Sign in</span></div>
      </div>
    </div>
  )
}

export default Sign;