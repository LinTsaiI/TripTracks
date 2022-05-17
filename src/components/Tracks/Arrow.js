import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TripContext, DirectionContext } from '../Trip/Trip';
import './Arrow.css';
import pathImg from '../../img/icons_itinerary.png';
import carImg from '../../img/icons_car.png';
import directionLoadingIcon from '../../img/icons_loading.gif';

const Arrow = ({ index }) => {
  const dispatch = useDispatch();
  const pinList = useSelector(state => state.trip.pinList);
  const tripValue = useContext(TripContext);
  const { setIsNoteOpen, setIsDirectionOpen, currentFocusDirection, setCurrentFocusDirection } = tripValue;
  const directionValue = useContext(DirectionContext);
  const { distance, duration } = directionValue;

  const directionLoadingIconClassName = (!distance[index] || !duration[index]) ? 'direction-fetching-icon' : 'arrow-display-none '
  const optimizedDrivingPath = (!distance[index] || !duration[index]) ? '' : `${distance[index]}, ${duration[index]}`;
  // 若為最後一個箭頭，不顯示
  const arrowClassName = (index == pinList.length - 1 ) ? 'arrow-display-none' : 'arrow';
  
  const handelDirection = (e) => {
    setIsNoteOpen(false);
    if (currentFocusDirection == null || currentFocusDirection == e.target.parentNode.id) {
      setCurrentFocusDirection(e.target.parentNode.id);
      setIsDirectionOpen(currentState => !currentState);
    } else {
      setCurrentFocusDirection(e.target.parentNode.id);
      setIsDirectionOpen(true);
    }
  }

  return (
    <div
      className={arrowClassName}
      id={index}
    >
      <img className='path-icon' src={pathImg} onClick={e => handelDirection(e)}/>
      <img src={carImg} className='car-icon'/>
      <img src={directionLoadingIcon} className={directionLoadingIconClassName}></img>
      <div className='direction'>{optimizedDrivingPath}</div>
    </div>
  )
}

export default Arrow;