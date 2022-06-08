import React, { useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePin, reOrderPinList } from '../../store/slice/tripSlice';
import { setInfoWindowContent } from '../../utilities';
import { MapContext, TripContext } from './Trip';
import Directions from './Directions';
import './Pin.css';
import trashCanIcon from '../../img/icons_trashcan.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';
import defaultMarker from '../../img/icons_hotelMarker.png';
import imgPlaceholder from '../../img/img_placeholder.png';

const Pin = ({ setIsNoteOpen, currentFocusNote, setCurrentFocusNote, setFocusInfoWindow } ) => {
  const dragPin = useRef();
  const dragOverPin = useRef();
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  const mapValue = useContext(MapContext);
  const { map, infoWindow } = mapValue;
  const tripValue = useContext(TripContext);
  const { pinMarkerList } = tripValue;
  const pinUpdating = dayTrack.isPinUpdating ? 'updating-pinList' : 'display-none';

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
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const photo = result.photos ? result.photos[0].getUrl() : imgPlaceholder;
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

        const infoWindowContent = setInfoWindowContent(placeName, icon, displayType, address, photo, rating, voteNumber, placeId, 'deleteBtn', trashCanIcon);
        infoWindow.setContent(infoWindowContent);
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
              <Directions index={index} />
            </div>
          )
        })
      }
      <div className={pinUpdating}></div>
    </div>
  )
}

export default Pin;