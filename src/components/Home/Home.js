import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Sign from './Sign';
import tripTracksIcon from '../../img/icon_triptracks.png';
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
        <div className='home-text-left'>
          <div className='home-text-left-content'>
            <h2>Your daily itinerary can be organized on one map</h2>
            <h3>Search places and arrange itineraries on separated maps of your trip duration</h3>
            <h3>Switch between days and follow the track you planned. Enjoy a wonderful trip</h3>
          </div>
          <img src='https://i.imgur.com/CO2L18E.gif'/>
        </div>
        <div className='home-inline'>
          <h2>Three different ways to search placese</h2>
          <div className='home-inline-imgs'>
            <div>
              <h3>Search on the search box</h3>
              <img src='https://i.imgur.com/kwMLK6F.png'/>
            </div>
            <div>
              <h3>Click a place on the map</h3>
              <img src='https://i.imgur.com/MnmLBYX.png'/>
            </div>
            <div>
              <h3>Customize an area for a specific place type</h3>
              <img src='https://i.imgur.com/QZBkeUj.png'/>
            </div>
          </div>
        </div>
        <div className='home-text-right'>
          <img src='https://i.imgur.com/AGQSFC2.gif'/>
          <div className='home-text-right-content'>
            <h2>Easy to change the order of the itinerary</h2>
            <h3>Drag and drop the order you want</h3>
          </div>
        </div>
        <div className='home-text-left'>
          <div className='home-text-left-content'>
            <h2>Find out directions</h2>
            <h3>View distance and time between places</h3>
          </div>
          <img src='https://i.imgur.com/Sezb0px.png'/>
        </div>
        <div className='home-text-right'>
          <img src='https://i.imgur.com/LHBUN0M.png'/>
          <div className='home-text-right-content'>
            <h2>Keep memo</h2>
            <h3>Take some notes about the places</h3>
          </div>
        </div>
        <div className='home-text-left'>
          <div className='home-text-left-content'>
            <h2>Browse in anywhere</h2>
            <h3>Support deesktop, tablet, and mobile devices</h3>
          </div>
          <img src='https://i.imgur.com/OPoH3Rl.png'/>
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