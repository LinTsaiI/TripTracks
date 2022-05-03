import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateDayTrack } from '../../store/slice/tripSlice';
import { switchNotes, showNotesContent } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import { deletePin } from '../../API';
import Arrow from './Arrow';
import './Pin.css';

const Pin = () => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const dispatch = useDispatch();
  const trackId = useSelector(state => state.trip.trackId);
  const dayTrack = useSelector(state => state.trip.dayTrack);
  // if (!day) {
  //   pinList = tripData.dayTrack[0].pinList;
  // } else {
  //   pinList = tripData.dayTrack[day-1].pinList;
  // }
  const renderNewDayTrack = (newDayTrack) => {
    dispatch(updateDayTrack({
      dayTrack: newDayTrack
    }));
  }

  const deleteSelectedPin = (e) => {
    deletePin(trackId, e.target.parentNode.id, renderNewDayTrack);
  }
  
  const handelNotes = (e) => {
    dispatch(hideDirection());
    dispatch(switchNotes({
      id: e.target.parentNode.id
    }));
    dispatch(showNotesContent({
      tripName: tripData.tripName,
      day: day,
      id: e.target.parentNode.id
    }));
  }

  return !dayTrack ? <div>Loading...</div> : (
    <div>
      { 
        dayTrack.pins.map((pin, index) => {
          return (
            <div key={index}> 
              <div className='pin-container' id={index}>
                <div
                  className='pin-name'
                >{pin.name}</div>
                <button onClick={e => handelNotes(e)}>Notes</button>
                <button onClick={e => deleteSelectedPin(e)}>Delete</button>
              </div>
              <Arrow index={index} />
            </div>
          )
        })
      }
    </div>
  )
}

export default Pin;