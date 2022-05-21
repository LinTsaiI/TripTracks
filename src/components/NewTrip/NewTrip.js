import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncCreateNewTrip } from '../../store/slice/newTripSlice';
import './NewTrip.css';

const getDate = (daysFromToday) => {
  let today = new Date();
  let date = new Date(today.setDate(today.getDate() + daysFromToday));
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  (mm < 10) ? mm = '0' + mm : mm;
  (dd < 10) ? dd = '0' + dd : dd;
  let displayDate = yyyy + '-' + mm + '-' + dd;
  return displayDate;
};

const NewTrip = ({ openModal }) => {
  const userId = useSelector(state => state.user.userId);
  const currentDate = getDate(0);
  const defaultEndDate = getDate(2);
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newTrip = useSelector(state => state.newTrip);

  useEffect(() => {
    if (newTrip.isNewTrip) {
      navigate(`/trip/${newTrip.newtTripId}`);
      openModal(false);
    }
  }, [newTrip.isNewTrip]);

  useEffect(() => {
    if (tripName) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [tripName]);

  const handelSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncCreateNewTrip({
      userId: userId,
      tripName: tripName,
      startDate: startDate,
      endDate: endDate
    }));
  };

  return (
    <div className='modal'>
      <div className='modal-main'>
        <div className='create-form-name'>Plan A New Trip</div>
        <div onClick={() => openModal(false)} className='close-btn'>&#215;</div>
        <form className='create-form' onSubmit={handelSubmit}>
          <div className='style-in-line'>
            <label htmlFor='trip-name' className='label-value'>Trip Name </label>
            <input type='text' id='trip-name' placeholder='Give a name to your trip!' onChange={e => setTripName(e.target.value)}/>
          </div>
          <div className='style-in-line'>
            <label htmlFor='start-date' className='label-value'>Start Date </label>
            <input type='date' id='start-date' placeholder='Start from' defaultValue={currentDate} onChange={e => setStartDate(e.target.value)}/>
          </div>
          <div className='style-in-line'>
            <label htmlFor='end-date' className='label-value'>End Date </label>
            <input type='date' id='end-date' placeholder='End on' defaultValue={currentDate} onChange={e => setEndDate(e.target.value)}/>
          </div>
          <input type='submit' value='Start to Plan' className='create-btn' disabled={disabled}/>
        </form>
      </div>
    </div>
  )
}

export default NewTrip;