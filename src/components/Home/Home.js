import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import WelcomeAnimation from '../WelcomeAnimation/WelcomeAnimation';
import Sign from './Sign';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Footer from '../Footer/Footer';
import tripTracksIcon from '../../img/icon_triptracks.png';
import part1_demo_img from '../../img/demo_img.jpeg';
import function_demo_img1 from '../../img/function_demo_01.png';
import function_demo_img2 from '../../img/function_demo_02.png';
import function_demo_img3 from '../../img/function_demo_03.png';
import responsiveDemo from '../../img/responsive_demo.png';
import './Home.css';

const Home = () => {
  const userId = useSelector(state => state.user.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false)
  const signModalClassName = isSignModalOpen ? 'sign-modal' : 'display-none';
  const [isSignInform, setIsSignForm] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const switchToSignInForm = () => {
    setIsSignForm(true);
  }

  const switchToSignUpForm = () => {
    setIsSignForm(false);
  }

  const startPlanning = () => {
    if (userId) {
      navigate('/dashboard');
    } else {
      setIsSignModalOpen(true);
    }
  };

  return isLoading ? <WelcomeAnimation /> : (
    <div className='home-outer-container'>
      <div className='home-hero'>
        <div className='home-title'>
          <img src={tripTracksIcon}/>
          TripTracks
        </div>
        <div className='home-slogan'>
          <h1>Explore the world with our trip planner</h1>
          <div className='home-slogan-p'>
            <h3>
              Travel needs to be simple
              Build and map your itineraries in a easier may
            </h3>
            <button onClick={startPlanning}>Start planning</button>
          </div>
        </div>
      </div>
      <div className='home-description'>
        <div className='home-part1'>
          <div className='home-part1-text'>
            <h2>A map is your daily itinerary</h2>
            <h3>Separate daily itineraries by maps. Easy to switch between different days.</h3>
            <h3>Follow the track you planned, and enjoy a wonderful trip.</h3>
          </div>
          <img src={part1_demo_img}/>
        </div>
        <div className='home-part2'>
          <h2>Easy to use</h2>
          <div className='home-part2-imgs'>
            <img src={function_demo_img1}/>
            <img src={function_demo_img2}/>
            <img src={function_demo_img3}/>
          </div>
        </div>
        <div className='home-part3'>
          <img src={responsiveDemo}/>
          <div className='home-part3-text'>
            <h2>Easy to browse</h2>
            <h3>We support desktop and a mobile device.</h3>
            <h3>Arrange your trip in anywhere and wherever you want</h3>
          </div>
        </div>
      </div>
      {
        <div className={signModalClassName}>
          <Sign
            isSignModalOpen={isSignModalOpen}
            setIsSignModalOpen={setIsSignModalOpen}
          />
        </div>
      }
      {/* <div className='sign-container'>
        {
          userId
          ? <button onClick={() => navigate('/dashboard')}>Start to Use</button>
          : <SignIn />
        }
      </div> */}
    </div>
  );
}

export default Home;

// sign in from => 輸入帳號、密碼 => submit 送出表單 call sign in API => response ok, 後端給一組jwt存在cookie => 前端顯示登入成功，三秒後轉跳到 /dashboard
// sign up form => 輸入使用者名稱、帳號、密碼 => submit 送出表單 call sign up API => response ok, 後端給一組jwt存在cookie => 前端顯示註冊成功，三秒後轉跳到 /dashboard