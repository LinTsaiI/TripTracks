import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showModal } from '../../store/slice/newTripSlice';
import './TripCard.css';

const TripCard = () => {
  const tripList = useSelector(state => state.dashboard.tripList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let tripCards = [];
  for (let i = 0; i < tripList.length; i++) {
    tripCards.push(
      <div
        key={i}
        className='trip-card'
        onClick={() => navigate(`/trip/${tripList[i].tripName}`)}
      >
        <div className='trip-card-content'>
          <div className='trip-name'>{tripList[i].tripName}</div>
          <div className='duration'>{tripList[i].duration} Days</div>
          <div className='duration'>{tripList[i].startDate} - {tripList[i].endDate}</div>
        </div>
      </div>
    )
  }
  tripCards.push(
    <div
      key={tripCards.length}
      className='trip-card'
      onClick={() => dispatch(showModal())}
    >
      <div className='plus-icon'>+</div>
    </div>
  )
  return tripCards;
}

export default TripCard;