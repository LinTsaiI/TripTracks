import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCard.css';

const TripCard = ({ tripList, openModal, isLoading }) => {
  const navigate = useNavigate();
  const loadingIcon = isLoading ? 'loading-icon' : 'display-none';
  const loading = <div className={loadingIcon} key='loading'/>

  let tripCards = [loading];
  for (let i = 0; i < tripList.length; i++) {
    tripCards.push(
      <div
        key={i}
        className='trip-card'
        onClick={() => navigate(`/trip/${tripList[i].tripId}`)}
      >
        <div className='trip-card-content'>
          <div className='trip-name'>{tripList[i].tripName}</div>
          <div className='duration'>{tripList[i].duration} Days</div>
          <div className='duration'>Start from {tripList[i].startDate}</div>
        </div>
      </div>
    )
  }
  tripCards.push(
    <div
      key={tripCards.length}
      className='trip-card'
      onClick={() => openModal(true)}
    >
      <div className='plus-icon'>+</div>
    </div>
  )
  return tripCards;
}

export default TripCard;