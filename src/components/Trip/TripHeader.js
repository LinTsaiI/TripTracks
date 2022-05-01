import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Days from './Days';
import './TripHeader.css';

const TripHeader = () => {
  const tripData = useSelector(state => state.trip.tripData);
  const tripName = tripData.tripName;
  const startDate = tripData.startDate;
  // const endDate = tripData.endDate;
  
  return (
    <div className='header'>
      <div className='header-plan'>
        <div className='style-flex'>
          <div className='header-plan-place'>{tripName}</div>
          <div className='header-plan-date'>{startDate}</div>
        </div>
        <Days />
      </div>
      <NavLink to='/dashboard'>
        <div className='header-avatar'>
          <div className='header-avatar-circle'>A</div>
        </div>
      </NavLink>
    </div>
  )
}

export default TripHeader;