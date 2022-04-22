import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotes } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import './Days.css';

const Days = () => {
  const tripData = useSelector(state => state.trip.tripData);
  const dispatch = useDispatch();

  let days = [];
  for(let i = 0; i < tripData.duration; i++) {
    days.push(
      <NavLink
        to={`/trip/${tripData.tripName}/${i+1}`}
        key={i+1}
        onClick={() => {
          dispatch(hideNotes());
          dispatch(hideDirection());
        }}
      >
        <div className='header-plan-day'>Day{i+1}</div>
      </NavLink>
    );
  }
  return days;
}

export default Days;