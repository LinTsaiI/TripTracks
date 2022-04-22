import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { switchToSignInForm, switchToSignUpForm } from '../../store/slice/userSlice';
import WelcomeAnimation from '../WelcomeAnimation/WelcomeAnimation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './Sign.css';

const Sign = () => {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return isLoading && !userState.isSignIn
    ? <WelcomeAnimation /> : (
    <div className='sign-outer-container'>
      <div className='sign-title'>TripTracks</div>
      <div className='website-slogan'>PLAN YOUR TRIP</div>
      <div className='sign-container'>
        <div className='sign-button-container'>
          <div className='sign-switch-btn' onClick={() => dispatch(switchToSignInForm())}>Sign In</div>
          <div className='sign-switch-btn' onClick={() => dispatch(switchToSignUpForm())}>Sign Up</div>
        </div>
        {
          userState.isSignIn
          ? <Navigate to='/dashboard' />
          : (
            userState.isSignInForm
            ? <SignIn />
            : <SignUp />
          )
        }
      </div>
    </div>
  );
}

export default Sign;

// sign in from => 輸入帳號、密碼 => submit 送出表單 call sign in API => response ok, 後端給一組jwt存在cookie => 前端顯示登入成功，三秒後轉跳到 /dashboard
// sign up form => 輸入使用者名稱、帳號、密碼 => submit 送出表單 call sign up API => response ok, 後端給一組jwt存在cookie => 前端顯示註冊成功，三秒後轉跳到 /dashboard