import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin, reOrderPinList } from '../../store/slice/tripSlice';
import { MapContext, TripContext } from '../Trip/Trip';
import Arrow from './Arrow';
import './Pin.css';
import trashCanIcon from '../../img/icons_trashcan.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';
import defaultMarker from '../../img/icons_hotelMarker.png';
import star from '../../img/icons_star.png';
import imgPlaceholder from '../../img/img_placeholder.png';

const Pin = () => {
  const dragPin = useRef();
  const dragOverPin = useRef();
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  const mapValue = useContext(MapContext);
  const { map, infoWindow } = mapValue;
  const tripValue = useContext(TripContext);
  const { setIsNoteOpen, currentFocusNote, setCurrentFocusNote, pinMarkerList, setFocusInfoWindow } = tripValue;
  const pinUpdatingClassName = dayTrack.isPinUpdating ? 'updating-pinList' : 'display-none';

  const switchToPin = (e) => {
    setFocusInfoWindow(null);
    const index = e.target.id;
    map.panTo(dayTrack.pinList[index].position);
    const service = new google.maps.places.PlacesService(map);
    let request = {
      placeId: dayTrack.pinList[index].id,
      fields: ['photos']
    };
    service.getDetails(request, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && result) {
        const photoUrl = result.photos[0].getUrl();
        const photo = photoUrl ? photoUrl : imgPlaceholder;
        const placeName = dayTrack.pinList[index].name;
        const address = dayTrack.pinList[index].address;
        const placeId = dayTrack.pinList[index].id;
        const type = dayTrack.pinList[index].type;
        const rating = dayTrack.pinList[index].rating ? dayTrack.pinList[index].rating : '';
        const voteNumber = dayTrack.pinList[index].voteNumber ? `(${dayTrack.pinList[index].voteNumber} Reviews)` : '';
        let displayType;
        let icon;
        switch (type) {
          case 'tourist_attraction':
            displayType = 'Attraction';
            icon = attractionIcon;
            break;
          case 'restaurant':
            displayType = 'Restaurant';
            icon = restaurantIcon;
            break;
          case 'cafe':
            displayType = 'Cafe';
            icon = cafeIcon;
            break;
          case 'bar':
            displayType = 'Bar';
            icon = barIcon;
            break;
          case 'store':
            displayType = 'Shop';
            icon = shopIcon;
            break;
          case 'lodging':
            displayType = 'Hotel';
            icon = hotelIcon;
            break;
          default:
            displayType = 'Others';
            icon = defaultMarker;
        }

        infoWindow.setContent(`
          <div style='width: 300px'>
            <div style='width: 100%; display: flex'>
              <div style='width: 60%'>
                <h2>${placeName}</h2>
                <div style='display: flex; align-items: center'>
                  <img src=${icon} style='width: 20px'>
                  <div style='font-size: 16px; margin: 0 3px'>${displayType}</div>
                </div>
                <h4>${address}</h4>
              </div>
              <div style='width: 40%; margin: 10px; background: #ffffff url("${photo}") no-repeat center center; background-size: cover'></div>
            </div>
            <div style='width: 100%; display: flex; align-items: end'>
              <div>
                <div style='display: flex; align-items: center; margin: 5px 0'>
                  <img src=${star} style='width: 15px; height: 15px'/>
                  <p style='margin: 0 3px'>${rating} ${voteNumber}</p>
                </div>
                <a style='color: #313131' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}' target='_blank'>Find on google map</a>
              </div>
              <img id='deleteBtn' src=${trashCanIcon} style='width: 28px; height: 28px; margin: 0 10px 0 auto; cursor: pointer;'/>
            </div>
          </div>
        `);
        infoWindow.open({
          anchor: pinMarkerList[index],
          map: map,
          shouldFocus: true,
          maxWidth: 350
        });
      } else {
        console.log('can not get place info');
      }
    });
  }

  const handelNotes = (e) => {
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
    const restPinIds = [...dayTrack.pinIds];
    const deleteTargetIndex = e.target.parentNode.id;
    restPinIds.splice(deleteTargetIndex, 1);
    const newDirectionOptions = [...dayTrack.directions];
    const directionOptionRemoveTarget = (deleteTargetIndex == dayTrack.pinList.length) ? deleteTargetIndex - 1 : deleteTargetIndex;
    newDirectionOptions.splice(directionOptionRemoveTarget, 1);
    dispatch(deletePin({
      tripId: dayTrack.tripId,
      trackId: dayTrack.trackId,
      pinId: dayTrack.pinIds[e.target.parentNode.id],
      restPinIds: restPinIds,
      newDirections: newDirectionOptions
    }));
  };

  const dragStart = (e, index) => {
    dragPin.current = index;
  };

  const dragEnter = (e, index) => {
    dragOverPin.current = index;
  }

  const dropt = () => {
    const pinIds = [...dayTrack.pinIds];
    const dragPinId = pinIds[dragPin.current];
    pinIds.splice(dragPin.current, 1);
    pinIds.splice(dragOverPin.current, 0, dragPinId);
    dispatch(reOrderPinList({
      tripId: dayTrack.tripId,
      trackId: dayTrack.trackId,
      newPinIds: pinIds
    }));
    dragPin.current = null;
    dragOverPin.current = null;
  };

  return (
    <div className='pin-collection'>
      { 
        dayTrack.pinList.map((pin, index) => {
          return (
            <div className='pin-container'
              key={index}
              draggable
              onDragOver={e => e.preventDefault()}
              onDragStart={e => dragStart(e, index)}
              onDragEnter={e => dragEnter(e, index)}
              onDragEnd={dropt}
            > 
              <div className='pin-block'>
                <div
                  id={index}
                  className='pin-name'
                  onClick={switchToPin}
                >{pin.name}</div>
                <div className='pin-btns' id={index}>
                  <button className='notes-btn' onClick={handelNotes}/>
                  <button className='delete-btn' onClick={deleteSelectedPin} title='Delete'/>
                </div>
              </div>
              <Arrow index={index} />
            </div>
          )
        })
      }
      <div className={pinUpdatingClassName}></div>
    </div>
  )
}

export default Pin;