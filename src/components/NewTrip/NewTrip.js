import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideModal, createNewTrip } from '../../store/slice/newTripSlice';
import { getCurrentDate } from '../utilities';
import './NewTrip.css';

const NewTrip = () => {
  const tripName = useRef();
  const startDate = useRef();
  const duration = useRef();
  const navigate = useNavigate();
  const currentDate = getCurrentDate();
  const modalState = useSelector(state => state.newTrip);
  const dispatch = useDispatch();
  const modalClassName = modalState.isShow ? 'modal' : 'display-none';

  useEffect(() => {
    if(modalState.createSuccessfully) {
      navigate(`/trip/${tripName.current.value}`);
      dispatch(hideModal());
    }
  }, [modalState.createSuccessfully]);

  const startToPlan = () => {
    dispatch(createNewTrip(
      {
        tripName: tripName.current.value,
        startDate: startDate.current.value,
        duration: duration.current.value
      }
    ));
  }


  return (
    <div className={modalClassName}>
      <div className='modal-main'>
        <div>Create Your Trip</div>
        <form className='form'>
          <label htmlFor='trip-name'>Trip Name: </label>
          <input type='text' id='trip-name' placeholder='Give a name to your trip' ref={tripName}/>
          <label htmlFor='start-date'>Start Date: </label>
          <input type='date' id='start-date' placeholder='Choose a date to start to plan' defaultValue={currentDate} ref={startDate}/>
          <label htmlFor='duration'>Duration: </label>
          <input type='number' id='duration' min='1' max='25' defaultValue='1' placeholder='How many days do you plan to stay' ref={duration} />
          <input type='button' value='Start to Plan' onClick={startToPlan}/>
          <div onClick={() => dispatch(hideModal())}>Close</div>
        </form>
      </div>
    </div>
  )
}

export default NewTrip;

// Start Date 預設當天日期
// 當點擊 Start to Plan => call API => 驗證資料 => 將輸入資訊儲存到資料庫 => response ok => navigate 到 `/trip/${tripName}`