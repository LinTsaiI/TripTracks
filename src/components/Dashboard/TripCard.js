import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCard.css';

const TripCard = ({ tripName, startDate, endDate, duration }) => {
  const navigate = useNavigate();
  return (
    <div className='trip-card' onClick={() => navigate(`/trip/${tripName}`)}>
      <div>{tripName}</div>
      <div>{startDate} - {endDate}</div>
      <div>{duration} Days</div>
    </div>
  )
}

export default TripCard;