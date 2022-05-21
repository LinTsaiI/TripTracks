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
      tripCardOptionModal.current.className = 'trip-card-option-modal';
      setOpenedTripCardOptionModal(tripCardOptionModal.current);
    } else if (openedTripCardOptionModal == tripCardOptionModal.current) {
      tripCardOptionModal.current.className = (tripCardOptionModal.current.className == 'trip-card-option-modal') ? 'display-none' : 'trip-card-option-modal';
    } else {
      openedTripCardOptionModal.className = 'display-none';
      tripCardOptionModal.current.className = 'trip-card-option-modal';
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
          >
            <img src={trashCanIcon}/>
            <div>Delete</div>
          </div>
        </div>
        <img
          src={tripCardCover}
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

  // let tripCards = [loading];
  // for (let i = 0; i < tripList.length; i++) {
  //   const startDate = new Date(tripList[i].startDate);
  //   const endDate = new Date(tripList[i].endDate);
  //   const startDateMMM = startDate.toDateString().split(' ')[1];
  //   const startDateDD = startDate.toDateString().split(' ')[2];
  //   const endDateMMM = endDate.toDateString().split(' ')[1];
  //   const endDateDD = endDate.toDateString().split(' ')[2];
  //   const displayDate = `${startDateMMM} ${startDateDD} - ${endDateMMM} ${endDateDD}`;
    
  //   tripCards.push(
  //     <div
  //       key={i} className='trip-card'>
  //       <div className='trip-card-cover'>
  //         <div
  //           className='trip-card-option'
  //           onClick={openTripCardOptions}
  //         >
  //           <img id={i} src={dotsIcon}/>
  //         </div>
  //         <div className='trip-card-option-modal'
  //           ref={tripCardOptionModal}
  //           onClick={deleteProject}
  //         >
  //           <img src={trashCanIcon}/>
  //           <div id={tripList[i].tripId}>Delete</div>
  //         </div>
  //         <img
  //           src={tripCardCover}
  //           className='trip-card-img'
  //           onClick={() => navigate(`/trip/${tripList[i].tripId}`)}
  //         />
  //       </div>
  //       <div
  //         className='trip-card-content'
  //         onClick={() => navigate(`/trip/${tripList[i].tripId}`)}
  //       >
  //         <div className='trip-name'>{tripList[i].tripName}</div>
  //         <div className='trip-card-date'>
  //           <img className='calendar-icon' src={calendar}/>
  //           <div className='duration'>{displayDate}</div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  // tripCards.push(
  //   <div
  //     key={tripCards.length}
  //     className='trip-card'
  //     onClick={() => openModal(true)}
  //   >
  //     <div className='new-trip'>
  //       <div className='plus-icon'>+</div>
  //     </div>
  //   </div>
  // )
  // return tripCards;
}

export default TripCard;