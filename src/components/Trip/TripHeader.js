import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Days from './Days';
import './TripHeader.css';

const TripHeader = ({ tripInfo }) => {
  // const tripData = useSelector(state => state.trip.tripData);
  const params = useParams();
  const tripId = params.tripId;

  const days = [];
  for(let i = 0; i < tripInfo.duration; i++) {
    days.push(
      <NavLink
        to={`/trip/${tripId}?day=${i+1}`}
        key={i+1}
        onClick={() => {
          dispatch(savePreviousTrackState());
          dispatch(hideNotes());
          dispatch(hideDirection());
        }}
      >
        <div className='header-plan-day'>Day{i+1}</div>
      </NavLink>
    );
  }
  
  return (
    <div className='header'>
      <div className='header-plan'>
        <div className='style-flex'>
          <div className='header-plan-place'>{tripInfo.tripName}</div>
          <div className='header-plan-date'>{tripInfo.startDate}</div>
        </div>
        {days}
        {/* <Days /> */}
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