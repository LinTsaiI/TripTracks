import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Pin from './Pin';
import './Tracks.css';
import calendar from '../../img/icons_calendar.png';

const displayDate = (start, end) => {
  const [startY, startM, startD] = start.split('-');
  const [endY, endM, endD] = end.split('-');
  const date = (startY == endY) ? `${startM}/${startD} - ${endM}/${endD}, ${startY}` : `${startM}/${startD}, ${startY} - ${endM}/${endD}, ${endY}`;
  return date;
};

const Tracks = ({ tripInfo }) => {
  const tripId = useSelector(state => state.trip.tripId);
  const tripDuration = displayDate(tripInfo.startDate, tripInfo.endDate);
  const startDate = new Date(tripInfo.startDate);
  const endDate = new Date(tripInfo.endDate);
  const date = [];
  let loopDay = startDate;
  let index = 0;
  while (loopDay <= endDate) {
    const month = loopDay.toDateString().split(' ')[1].toUpperCase();
    const day = loopDay.toDateString().split(' ')[2];
    date.push(
      <NavLink
        // style={({ isActive }) => {
        //   return {
        //     color: isActive ? "red" : "",
        //   };
        // }}
        to={`/trip/${tripId}?day=${index+1}`}
        key={index}
      >
        <div className='trip-date-block'>
          <div className='trip-date-month'>{month}</div>
          <div className='trip-date-day'>{day}</div>
        </div>
      </NavLink>
    );
    let nextDate = loopDay.setDate(loopDay.getDate() + 1);
    loopDay = new Date(nextDate);
    index++;
  }

  return (
    <div className='side-bar'>
      <div className='header'>
        <div className='header-plan'>
          <div>
            <div className='header-plan-place'>{tripInfo.tripName}</div>
            <div className='header-plan-date'>
              <img className='calendar-icon' src={calendar}/>
              <div className='header-plan-duration'>{tripDuration}</div>
            </div>
          </div>
        </div>
        <NavLink to='/dashboard'>
          <div className='header-avatar'>
            <div className='header-avatar-circle'>A</div>
          </div>
        </NavLink>
      </div>
      <div className='tracks-container'>
        <div className='trip-date'>
          {date}
        </div>
        <Pin/>
      </div>
    </div>
  );
};

export default Tracks;