import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { storage } from '../../firebase';
import { ref, getDownloadURL } from "firebase/storage";
import Pin from './Pin';
import './Tracks.css';
import calendar from '../../img/icons_calendar.png';
import defaultAvatar from '../../img/blank_profile_avatar.png';

const displayDate = (start, end) => {
  const [startY, startM, startD] = start.split('-');
  const [endY, endM, endD] = end.split('-');
  const date = (startY == endY) ? `${startM}/${startD} - ${endM}/${endD}, ${startY}` : `${startM}/${startD}, ${startY} - ${endM}/${endD}, ${endY}`;
  return date;
};

const Tracks = ({ tripInfo }) => {
  const user = useSelector(state => state.user);
  const tripId = useSelector(state => state.trip.tripId);
  const tripDuration = displayDate(tripInfo.startDate, tripInfo.endDate);
  const [avatar, setAvatar] = useState(null);
  const avatarFetchingClassName = user.avatar ? 'header-avatar-circle' : 'header-avatar-circle header-avatar-loading-background';
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

  useEffect(() => {
    if (user.avatar) {
      if (user.avatar == 'default') {
        setAvatar(defaultAvatar);
      } else {
          getDownloadURL(ref(storage, user.avatar))
            .then(url => {
              setAvatar(url);
            })
            .catch(err => {
              console.log('Something goes wrong', err);
            });
      }
    }
  }, [user.avatar]);

  return (
    <div className='sidebar'>
      <div className='header'>
        <div className='header-plan'>
          <div>
            <div className='header-plan-place'>{tripInfo.tripName}</div>
            <div className='header-plan-date'>
              <img src={calendar}/>
              <div className='header-plan-duration'>{tripDuration}</div>
            </div>
          </div>
        </div>
        <NavLink to='/dashboard'>
          <div className='header-avatar'>
            <div className={avatarFetchingClassName}>
              <img src={avatar} className='header-avatar-img'/>
            </div>
          </div>
        </NavLink>
      </div>
      <div className='tracks-container'>
        <div className='trip-date'>
          {date}
        </div>
        <Pin />
      </div>
    </div>
  );
};

export default Tracks;