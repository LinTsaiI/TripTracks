import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin } from '../../store/slice/tripSlice';
import { switchNotes, showNotesContent } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import Arrow from './Arrow';
import './Pin.css';

const Pin = () => {
  const params = useParams();
  const day = params.day;
  const dispatch = useDispatch();
  const tripData = useSelector(state => state.trip.tripData);
  let pinList;
  if (!day) {
    pinList = tripData.dayTrack[0].pinList;
  } else {
    pinList = tripData.dayTrack[day-1].pinList;
  }
  const deleteSelectedPin = (e) => {
    dispatch(deletePin({
      tripName: tripData.tripName,
      day: day,
      id: e.target.parentNode.id
    }))
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

  return (
    <div>
      { 
        pinList.map((pin, index) => {
          return (
            <div key={index}> 
              <div className='pin-container' id={index}>
                <div
                  className='pin-name'
                >{pin.name}</div>
                <button onClick={e => handelNotes(e)}>Notes</button>
                <button onClick={e => deleteSelectedPin(e)}>Delete</button>
              </div>
              <Arrow index={index} number={pinList.length}/>
            </div>
          )
        })
      }
    </div>
  )
}

export default Pin;