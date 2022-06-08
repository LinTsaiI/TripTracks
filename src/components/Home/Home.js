import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Sign from './Sign';
import tripTracksIcon from '../../img/icon_triptracks.png';
import function_demo_img1 from '../../img/function_demo_01.png';
import function_demo_img2 from '../../img/function_demo_02.png';
import function_demo_img3 from '../../img/function_demo_03.png';
import mapDemo from '../../img/map_demo.gif';
import RWD from '../../img/RWD.png';
import './Home.css';

const Home = () => {
  const userId = useSelector(state => state.user.userId);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isUserStateProcessing, setIsUserStateProcessing] = useState(false);
  const signModalClassName = isSignModalOpen ? 'auth-modal' : 'display-none';
  const processingLoading = isUserStateProcessing ? 'user-state-loading' : 'display-none';
  const navigate = useNavigate();

  const startPlanning = () => {
    if (userId) {
      navigate('/dashboard');
    } else {
      setIsSignModalOpen(true);
    }
  };

  return (
    <div>
      <div className={processingLoading}></div>
      <div className='home-hero'>
        <div className='home-title'>
          <img src={tripTracksIcon}/>
          TripTracks
        </div>
        <div className='home-slogan'>
          <h1>Explore the world with our trip planner</h1>
          <div className='home-slogan-text'>
            <h3>Travel needs to be simple</h3>
            <h3>Build and map your itineraries in a easier may</h3>
          </div>
          <button onClick={startPlanning}>Start planning</button>
        </div>
      </div>
      <div className='home-description'>
        <div className='home-part1'>
          <div className='home-part1-text'>
            <h2>A map is your daily itinerary</h2>
            <h3>Separate daily itineraries by maps. Easy to switch between different days.</h3>
            <h3>Follow the track you planned, and enjoy a wonderful trip.</h3>
          </div>
          <img src={mapDemo}/>
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
          <img src={RWD}/>
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
            setIsUserStateProcessing={setIsUserStateProcessing}
          />
        </div>
      }
    </div>
  );
}

export default Home;