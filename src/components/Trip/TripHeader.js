import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Days from './Days';
import './TripHeader.css';

const TripHeader = ({ tripInfo }) => {
  const params = useParams();
  const tripId = params.tripId;
  const dispatch = useDispatch();

  const days = [];
  for(let i = 0; i < tripInfo.duration; i++) {
    days.push(
      <Link
        to={`/trip/${tripId}?day=${i+1}`}
        key={i+1}
      >
        <div className='header-plan-day'>Day{i+1}</div>
      </Link>
    );
  }
  
  return (
    <div className='header'>
      <div className='header-plan'>
        <div className='style-flex'>
          <div className='header-plan-place'>{tripInfo.tripName}</div>
          <div className='header-plan-day'>{tripInfo.startDate}</div>
        </div>
        <nav>
          {days}
        </nav>
        {/* <Days /> */}
      </div>
      <Link to='/dashboard'>
        <div className='header-avatar'>
          <div className='header-avatar-circle'>A</div>
        </div>
      </Link>
    </div>
  )
}

export default TripHeader;