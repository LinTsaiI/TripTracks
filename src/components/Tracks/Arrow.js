import React, { useContext, useState, useRef, useEffect } from 'react';
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
  const directions = useSelector(state => state.trip.directions);
  const tripValue = useContext(TripContext);
  const { openedDropdownMenu, setOpenedDropdownMenu, setIsNoteOpen, setIsDirectionOpen, currentFocusDirection, setCurrentFocusDirection } = tripValue;
  const directionValue = useContext(DirectionContext);
  const { directionsService, distance, duration, otherDirectionChoices, setOtherDirectionChoices } = directionValue;
  const dropdownMenu = useRef();
  const travelMode = [
    { mode: 'DRIVING', icon: carIcon },
    { mode: 'TRANSIT', icon: trainIcon },
    { mode: 'WALKING', icon: walkIcon }
  ]

  const directionLoadingIconClassName = (!distance[index] || !duration[index]) ? 'direction-fetching-icon' : 'display-none ';
  const directionInfo = (!distance[index] || !duration[index]) ? '' : `${distance[index]}・${duration[index]}`;
  // 若為最後一個箭頭，不顯示
  const arrowClassName = (index == pinList.length - 1 ) ? 'display-none' : 'arrow';

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

  const switchDropdownModal = (e) => {
    if (!openedDropdownMenu) {
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
      getOtherDirections(e.target.parentNode.id);
    } else if(openedDropdownMenu == dropdownMenu.current) {
      if (dropdownMenu.current.className == 'dropdownModal') {  
        setOtherDirectionChoices([]);
        dropdownMenu.current.className = 'display-none';
      } else {
        dropdownMenu.current.className = 'dropdownModal';
        getOtherDirections(e.target.parentNode.id);
      }
    } else {
      setOtherDirectionChoices([]);
      openedDropdownMenu.className = 'display-none';
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
      getOtherDirections(e.target.parentNode.id);
    }
  }

  const getOtherDirections = (index) => {
    if (pinList) {
      const start = pinList[index].position;
      const end = pinList[parseInt(index)+1].position;
      let otherTravelMode;
      if (directions[index] == '' || 'DRIVING') {
        otherTravelMode = travelMode.filter(item => item.mode != 'DRIVING');
      } else if (directions[index] == 'TRANSIT') {
        otherTravelMode = travelMode.filter(item => item.mode != 'TRANSIT');
      } else {
        otherTravelMode = travelMode.filter(item => item.mode != 'WALKING');
      }
      otherTravelMode.forEach(item => {
        const directionRequest = {
          origin: start,
          destination: end,
          travelMode: item.mode,
          drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'pessimistic'
          },
          transitOptions: {
            modes: ['BUS', 'RAIL', 'SUBWAY', 'TRAIN', 'TRAM'],
            routingPreference: 'FEWER_TRANSFERS'
          },
          unitSystem: google.maps.UnitSystem.METRIC,
        };
        directionsService.route(directionRequest, (result, status) => {
          if (status == 'OK') {
            const distance = result.routes[0].legs[0].distance.text;
            const duration = result.routes[0].legs[0].duration.text;
            setOtherDirectionChoices(current => [...current, {
              value: `${distance}・${duration}`,
              icon: item.icon
            }]);
          } else if (status == 'ZERO_RESULTS') {
            setOtherDirectionChoices(current => [...current, {
              value: 'No results',
              icon: item.icon
            }]);
          }
        });
      });
    }
  };

  return (
    <div
      className={arrowClassName}
      onClick={switchDropdownModal}
    >
      <div className='arrow-content' id={index}>
        <img className='path-icon' src={pathIcon} onClick={e => handelDirection(e)}/>
        <img src={carIcon} className='default-direction-icon'/>
        <img src={directionLoadingIcon} className={directionLoadingIconClassName}/>
        <div className='direction'>{directionInfo}</div>
        <img src={icons_triangle} className='dropdown-icon'/>
        <div className='display-none' ref={dropdownMenu}>
          { 
            otherDirectionChoices.length == 0
            ? <img src={directionLoadingIcon} className='other-direction-fetching-icon'/>
            : (
              otherDirectionChoices.map((choice, index) => {
                return (
                  <div className='other-direction-choice' key={index}>
                    <img src={choice.icon} className='other-direction-icon'/>
                    <div>{choice.value}</div>
                  </div>
                )
              })
            )
          }
          <div className='direction-anchor'>
            <a onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${pinList[index].position.lat},${pinList[index].position.lng}&destination=${pinList[parseInt(index)+1].position.lat},${pinList[parseInt(index)+1].position.lng}`)}>Find Details</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrow;