import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin } from '../../store/slice/tripSlice';
import { TripContext } from '../Trip/Trip';
import Arrow from './Arrow';
import './Pin.css';

const Pin = () => {
  const dispatch = useDispatch();
  const pinList = useSelector(state => state.trip.pinList);
  const trackId = useSelector(state => state.trip.trackId);
  const pinId = useSelector(state => state.trip.pinId);
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
      pinId: pinId[e.target.parentNode.id],
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
                <button onClick={deleteSelectedPin}>Delete</button>
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