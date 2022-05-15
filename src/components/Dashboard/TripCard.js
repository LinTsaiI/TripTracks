import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCard.css';
import calendar from '../../img/icons_calendar.png';

const TripCard = ({ tripList, openModal, isLoading }) => {
  const navigate = useNavigate();
  const loadingIcon = isLoading ? 'loading-icon' : 'display-none';
  const loading = <div className={loadingIcon} key='loading'/>

  let tripCards = [loading];
  for (let i = 0; i < tripList.length; i++) {
    const startDate = new Date(tripList[i].startDate);
    const endDate = new Date(tripList[i].endDate);
    const startDateMMM = startDate.toDateString().split(' ')[1];
    const startDateDD = startDate.toDateString().split(' ')[2];
    const endDateMMM = endDate.toDateString().split(' ')[1];
    const endDateDD = endDate.toDateString().split(' ')[2];
    const displayDate = `${startDateMMM} ${startDateDD} - ${endDateMMM} ${endDateDD}`;
    
    tripCards.push(
      <div
        key={i}
        className='trip-card'
        onClick={() => navigate(`/trip/${tripList[i].tripId}`)}
      >
        <div className='trip-card-img'></div>
        <div className='trip-card-content'>
          <div className='trip-name'>{tripList[i].tripName}</div>
          <div className='trip-card-date'>
            <img className='calendar-icon' src={calendar}/>
            <div className='duration'>{displayDate}</div>
          </div>
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
      <div className='new-trip'>
        <div className='plus-icon'>+</div>
      </div>
    </div>
  )
  return tripCards;
}

export default TripCard;