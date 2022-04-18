import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { signIn } from '../../store/slice/userSlice';
import WelcomeAnimation from '../WelcomeAnimation/WelcomeAnimation';

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
    <div>
      <h1>Please Sign In or Sign Up</h1>
      {
        userState.isSignIn
        ? <Navigate to='/dashboard' />
        : <button onClick={() => dispatch(signIn())}>Click to Sign In</button>
      }
    </div>
  )
}

export default Sign;

// sign in from => 輸入帳號、密碼 => submit 送出表單 call sign in API => response ok, 後端給一組jwt存在cookie => 前端顯示登入成功，三秒後轉跳到 /dashboard
// sign up form => 輸入使用者名稱、帳號、密碼 => submit 送出表單 call sign up API => response ok, 後端給一組jwt存在cookie => 前端顯示註冊成功，三秒後轉跳到 /dashboard