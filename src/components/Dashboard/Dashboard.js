import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { setUserId } from '../../store/slice/userSlice';
import { setTripList } from '../../store/slice/tripSlice';
import { getTripList } from '../../API';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
// import { getTotalTrip } from '../../store/slice/dashboardSlice';
import './Dashboard.css';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);
  const tripList = useSelector(state => state.trip.tripList);

  useEffect(() => {
    if (userId) {
      getTripList(userId)
        .then(result => {
          dispatch(setTripList({
            tripList: result
          }));
        });
    }
  }, []);
  // useEffect(() => {
  //   dispatch(getTotalTrip({
  //     userId: userId
  //   }));
  // }, []);

  const userSignOut = () => {
    signOut(auth).then(() => {
      dispatch(setUserId({
        userId: null
      }));
    }).catch(error => console.log(error))

  }

  return !tripList ? <div>Loading...</div> : (
    <div>
      <div className='dashboard-container'>
        <div className='dashboard-menu'>
          <div className='dashboard-avatar'>A</div>
          <div className='menu-item'>My trips</div>
          <button className='sign-out-btn' onClick={userSignOut}>Sign Out</button>
        </div>
        <div className='collections'>
          <TripCard openModal={setIsModalShown}/>
        </div>
      </div>
      {
        isModalShown ? <NewTrip openModal={setIsModalShown} /> : <div/>
      }
      <Footer />
    </div>
  )
}

export default Dashboard;