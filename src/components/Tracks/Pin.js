import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin } from '../../store/slice/tripSlice';
import { MapContext, TripContext } from '../Trip/Trip';
import Arrow from './Arrow';
import './Pin.css';
import trashCanIcon from '../../img/icons_trashcan.png';

const Pin = () => {
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  const mapValue = useContext(MapContext);
  const { map, infoWindow } = mapValue;
  const tripValue = useContext(TripContext);
  const { setIsNoteOpen, setIsDirectionOpen, currentFocusNote, setCurrentFocusNote, pinMarkerList, setFocusInfoWindow } = tripValue;

  const switchToPin = (e) => {
    setFocusInfoWindow(null);
    const index = e.target.id;
    map.panTo(dayTrack.pinList[index].position);
    infoWindow.setContent(`
      <div style='width: 300px'>
        <div style='width: 100%; display: flex'>
          <div style='width: 60%'>
            <h2>${dayTrack.pinList[index].name}</h2>
            <h5>${dayTrack.pinList[index].address}</h5>
          </div>
          <div style='width: 40%; margin: 0 0 10px 10px; background: #ffffff url("${dayTrack.pinList[index].photo}") no-repeat center center; background-size: cover'></div>
        </div>
        <img id='deleteBtn' src=${trashCanIcon} title='Delete' style='float: right; width: 28px; height: 28px; margin: 0 10px; cursor: pointer;'/>
      </div>
    `);
    infoWindow.open({
      anchor: pinMarkerList[index],
      map: map,
      shouldFocus: true,
      maxWidth: 350
    });
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
  };

  const deleteSelectedPin = (e) => {
    setIsNoteOpen(false);
    setIsDirectionOpen(false);
    dispatch(deletePin({
      tripId: dayTrack.tripId,
      trackId: dayTrack.trackId,
      pinId: dayTrack.pinIds[e.target.parentNode.id],
    }));
  };

  return !dayTrack.pinList ? <div>Loading...</div> : (
    <div className='pin-collection'>
      { 
        dayTrack.pinList.map((pin, index) => {
          return (
            <div key={index} className='pin-container'> 
              <div className='pin-block'>
                <div
                  id={index}
                  className='pin-name'
                  onClick={switchToPin}
                >{pin.name}</div>
                <div className='pin-btns' id={index}>
                  <button className='notes-btn' onClick={handelNotes}/>
                  <button className='delete-btn' onClick={deleteSelectedPin}/>
                </div>
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