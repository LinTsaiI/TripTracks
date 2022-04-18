import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../store/slice/userSlice';
import { showModal } from '../../store/slice/newTripSlice';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const tripList = useSelector(state => state.dashboard.tripList);

  return (
      <div>
        <div>My trips</div>
        <button onClick={() => dispatch(signOut())}>Click to Sign Out</button>
        <hr/>
        <h1>This is Member Dashboard</h1>
        {
          tripList.map((trip, index) => {
            return <TripCard
              key={index}
              tripName={trip.tripName}
              startDate={trip.startDate}
              endDate={trip.endDate}
              duration={trip.duration}
            />
          })
        }
        <h3 onClick={() => dispatch(showModal())}>Create A Map</h3>
        <NewTrip />
        <Footer />
      </div>
    )
}

export default Dashboard;