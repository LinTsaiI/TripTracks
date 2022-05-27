import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncDeleteTrip } from '../../store/slice/dashboardSlice';
import './TripCard.css';
import calendar from '../../img/icons_calendar.png';
import tripCardCover from '../../img/london.jpeg';
import dotsIcon from '../../img/icons_dots.png';
import trashCanIcon from '../../img/icons_trashcan.png';

const TripCard = ({ trip, index, openedTripCardOptionModal, setOpenedTripCardOptionModal }) => {
  const navigate = useNavigate();
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  const tripCardOptionModal = useRef();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const startDateMMM = startDate.toDateString().split(' ')[1];
  const startDateDD = startDate.toDateString().split(' ')[2];
  const endDateMMM = endDate.toDateString().split(' ')[1];
  const endDateDD = endDate.toDateString().split(' ')[2];
  const displayDate = `${startDateMMM} ${startDateDD} - ${endDateMMM} ${endDateDD}`;


  const openTripCardOptions = () => {
    if (!openedTripCardOptionModal) {
      tripCardOptionModal.current.parentNode.className = 'trip-card-option-opened';
      tripCardOptionModal.current.className = 'trip-card-option-modal';
      setOpenedTripCardOptionModal(tripCardOptionModal.current);
    } else if (openedTripCardOptionModal == tripCardOptionModal.current) {
      if (tripCardOptionModal.current.className == 'trip-card-option-modal') {
        tripCardOptionModal.current.parentNode.className = 'trip-card-option';
        tripCardOptionModal.current.className = 'display-none';
      } else {
        tripCardOptionModal.current.parentNode.className = 'trip-card-option-opened';
        tripCardOptionModal.current.className = 'trip-card-option-modal';
      }
    } else {
      openedTripCardOptionModal.parentNode.className = 'trip-card-option';
      openedTripCardOptionModal.className = 'display-none';
      tripCardOptionModal.current.className = 'trip-card-option-modal';
      tripCardOptionModal.current.parentNode.className = 'trip-card-option-opened';
      setOpenedTripCardOptionModal(tripCardOptionModal.current);
    }
  };

  const deleteProject = (tripId) => {
    dispatch(asyncDeleteTrip({
      userId: userId,
      tripId: tripId
    }));
  };

  return (
    <div className='trip-card'>
      <div className='trip-card-cover'>
        <div
          className='trip-card-option'
          onClick={(e) => openTripCardOptions(e, index)}
        >
          <img id={index} src={dotsIcon}/>
          <div className='display-none'
            ref={tripCardOptionModal}
            onClick={() => deleteProject(trip.tripId)}
            title='Delete'
          >
            <img src={trashCanIcon}/>
            <div>Delete</div>
          </div>
        </div>
        <img
          src={trip.cover}
          className='trip-card-img'
          onClick={() => navigate(`/trip/${trip.tripId}`)}
        />
      </div>
      <div
        className='trip-card-content'
        onClick={() => navigate(`/trip/${trip.tripId}`)}
      >
        <div className='trip-name'>{trip.tripName}</div>
        <div className='trip-card-date'>
          <img className='calendar-icon' src={calendar}/>
          <div className='duration'>{displayDate}</div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;