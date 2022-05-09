import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateDayTrack, deletePin } from '../../store/slice/tripSlice';
import { switchNotes, showNotesContent } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import { MapContentContext } from '../MapContent/MapContent';
import Arrow from './Arrow';
import './Pin.css';

const Pin = () => {
  const dispatch = useDispatch();
  const pinList = useSelector(state => state.trip.pinList);
  const trackId = useSelector(state => state.trip.trackId);
  const value = useContext(MapContentContext);
  const { setIsNoteOpen, setIsDirectionOpen, currentFocusNote, setCurrentFocusNote } = value;
  // if (!day) {
  //   pinList = tripData.dayTrack[0].pinList;
  // } else {
  //   pinList = tripData.dayTrack[day-1].pinList;
  // }
  // const renderNewDayTrack = (newDayTrack) => {
  //   dispatch(updateDayTrack({
  //     dayTrack: newDayTrack
  //   }));
  // }

  const deleteSelectedPin = (e) => {
    dispatch(deletePin({
      trackId: trackId,
      targetIndex: e.target.parentNode.id
    }));
  }
  
  const handelNotes = (e) => {
    setIsDirectionOpen(false);
    if (currentFocusNote == null || currentFocusNote == e.target.parentNode.id) {
      setCurrentFocusNote(e.target.parentNode.id);
      setIsNoteOpen(currentState => !currentState);
    } else {
      setCurrentFocusNote(e.target.parentNode.id);
      setIsNoteOpen(true);
    }
    
    // dispatch(hideDirection());
    // dispatch(switchNotes({
    //   id: e.target.parentNode.id
    // }));
    // dispatch(showNotesContent({
    //   tripName: tripData.tripName,
    //   day: day,
    //   id: e.target.parentNode.id
    // }));
  }

  return !pinList ? <div>Loading</div> : (
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
              <Arrow index={index} />
            </div>
          )
        })
      }
    </div>
  )
}

export default Pin;