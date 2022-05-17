import React, { useContext, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TripContext, DirectionContext } from '../Trip/Trip';
import './Arrow.css';
import pathIcon from '../../img/icons_itinerary.png';
import carIcon from '../../img/icons_car.png';
import trainIcon from '../../img/icons_train.png';
import walkIcon from '../../img/icons_walk.png';
import directionLoadingIcon from '../../img/icons_loading.gif';
import icons_triangle from '../../img/icons_triangle.png';

const Arrow = ({ index }) => {
  const dispatch = useDispatch();
  const pinList = useSelector(state => state.trip.pinList);
  const tripValue = useContext(TripContext);
  const { openedDropdownMenu, setOpenedDropdownMenu, setIsNoteOpen, setIsDirectionOpen, currentFocusDirection, setCurrentFocusDirection } = tripValue;
  const directionValue = useContext(DirectionContext);
  const { distance, duration } = directionValue;
  const dropdownMenu = useRef();

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

  const switchDropdownModal = () => {
    if (!openedDropdownMenu) {
      console.log('first open')
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
    } else if(openedDropdownMenu == dropdownMenu.current) {
      dropdownMenu.current.className = dropdownMenu.current.className == 'dropdownModal' ? 'display-none' : 'dropdownModal';
    } else {
      openedDropdownMenu.className = 'display-none';
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
    }
  }

  return (
    <div
      className={arrowClassName}
      id={index}
    >
      <img className='path-icon' src={pathIcon} onClick={e => handelDirection(e)}/>
      <img src={carIcon} className='default-direction-icon'/>
      <img src={directionLoadingIcon} className={directionLoadingIconClassName}></img>
      <div className='direction'>{optimizedDrivingPath}</div>
      <img src={icons_triangle} className='dropdown-icon' onClick={switchDropdownModal}/>
      <div className='display-none' ref={dropdownMenu}>
        <div className='other-direction-choice'>
          <img src={trainIcon} className='other-direction-icon'/>
          <div>8 min by transit</div>
          <div>・6km</div>
        </div>
        <div className='other-direction-choice'>
          <img src={walkIcon} className='other-direction-icon'/>
          <div>18 min walk</div>
          <div>・1.2km</div>
        </div>
      </div>
    </div>
  )
}

export default Arrow;