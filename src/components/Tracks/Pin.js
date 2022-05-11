import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin } from '../../store/slice/tripSlice';
import { switchNotes, showNotesContent } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import { TripContext } from '../Trip/Trip';
import Arrow from './Arrow';
import './Pin.css';

const Pin = () => {
  const dispatch = useDispatch();
  const pinList = useSelector(state => state.trip.pinList);
  const trackId = useSelector(state => state.trip.trackId);
  const value = useContext(TripContext);
  const { setIsNoteOpen, setIsDirectionOpen, currentFocusNote, setCurrentFocusNote, pinMarkerList } = value;

  const handelNotes = (e) => {
    setIsDirectionOpen(false);
    if (currentFocusNote == null || currentFocusNote == e.target.parentNode.id) {
      setCurrentFocusNote(e.target.parentNode.id);
      setIsNoteOpen(currentState => !currentState);
    } else {
      setCurrentFocusNote(e.target.parentNode.id);
      setIsNoteOpen(true);
    }
  };

  const deleteSelectedPin = (e) => {
    setIsNoteOpen(false);
    setIsDirectionOpen(false);
    dispatch(deletePin({
      trackId: trackId,
      targetIndex: e.target.parentNode.id
    }));
    // const currentPinMarkerList = [...pinMarkerList];
    // currentPinMarkerList[e.target.parentNode.id].setMap(null);
  };

  return !pinList ? <div>Loading...</div> : (
    <div>
      { 
        pinList.map((pin, index) => {
          return (
            <div key={index}> 
              <div className='pin-container' id={index}>
                <div
                  className='pin-name'
                >{pin.name}</div>
                <button onClick={handelNotes}>Notes</button>
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