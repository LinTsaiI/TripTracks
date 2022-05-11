import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentDate } from '../utilities';
import { createNewTrip } from '../../API';
import './NewTrip.css';

const NewTrip = ({ openModal }) => {
  const userId = useSelector(state => state.user.userId);
  const currentDate = getCurrentDate();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(currentDate);
  const [duration, setDuration] = useState(1);
  const [tripId, setTripId] = useState(null);
  const [isCreateSuccessfully, setIsCreateSuccessfully] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCreateSuccessfully) {
      navigate(`/trip/${tripId}`);
      openModal(false);
    }
  }, [isCreateSuccessfully]);

  const handelSubmit = (e) => {
    e.preventDefault();
    createNewTrip(userId, tripName, startDate, duration, setTripId, setIsCreateSuccessfully);
  }

  return (
    <div className='modal'>
      <div className='modal-main'>
        <div className='create-form-name'>Plan A New Trip</div>
        <div onClick={() => openModal(false)} className='close-btn'>&#215;</div>
        <form className='create-form' onSubmit={handelSubmit}>
          <div className='style-on-line'>
            <label htmlFor='trip-name' className='label-value'>Trip Name </label>
            <input type='text' id='trip-name' placeholder='Give a name to your trip!' onChange={e => setTripName(e.target.value)}/>
          </div>
          <div className='style-on-line'>
            <label htmlFor='start-date' className='label-value'>Start Date </label>
            <input type='date' id='start-date' placeholder='Choose a date to start to plan' defaultValue={currentDate} onChange={e => setStartDate(e.target.value)}/>
          </div>
          <div className='style-on-line'>
            <label htmlFor='duration' className='label-value'>Duration </label>
            <input type='number' id='duration' min='1' max='25' defaultValue='1' placeholder='How many days do you plan to stay' onChange={e => setDuration(e.target.value)}/>
          </div>
          <input type='submit' value='Start to Plan' className='create-btn'/>
        </form>
      </div>
    </div>
  )
}

export default NewTrip;

// Start Date 預設當天日期
// 當點擊 Start to Plan => call API => 驗證資料 => 將輸入資訊儲存到資料庫 => response ok => navigate 到 `/trip/${tripName}`