import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TripContext, DirectionContext } from '../Trip/Trip';
import { switchDirection, getDirectionChoice } from '../../store/slice/directionSlice';
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
  let arrowClassName;
  let way;
  let time;
  let pinAName;
  let pinBName;
  let latA;
  let lngA;
  let latB;
  let lngB;
  if (index == pinList.length - 1 ) {   // 若為最後一個箭頭，不顯示
    arrowClassName = 'arrow-display-none';
  } else {
    arrowClassName = 'arrow';
    pinAName = pinList[index].name;
    pinBName = pinList[index+1].name;
    latA = pinList[index].lat;
    lngA = pinList[index].lng;
    latB = pinList[index+1].lat;
    lngB = pinList[index+1].lng;
  }
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