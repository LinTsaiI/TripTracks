import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../store/slice/userSlice';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import { getTotalTrip } from '../../store/slice/dashboardSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const tripList = useSelector(state => state.dashboard.tripList);
  const username = userState.username;
  useEffect(() => {
    dispatch(getTotalTrip({
      memberId: '123'   // 從 session 取得使用者id
    }))
  }, [])

  return !tripList ? <div>Loading...</div> : (
    <div>
      <div className='dashboard-container'>
        <div className='dashboard-menu'>
          <div className='dashboard-avatar'>A</div>
          <div className='menu-item'>My trips</div>
          <button className='sign-out-btn' onClick={() => dispatch(signOut())}>Sign Out</button>
        </div>
        <div className='collections'>
          <TripCard />
        </div>
      </div>
      <NewTrip />
      <Footer />
    </div>
  )
}

export default Dashboard;