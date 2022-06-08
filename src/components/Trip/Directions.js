import React, { useContext, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { changeDirectionOptions } from '../../store/slice/tripSlice';
import { TripContext, MapContext } from './Trip';
import './Directions.css';
import pathIcon from '../../img/icons_itinerary.png';
import carIcon from '../../img/icons_car.png';
import trainIcon from '../../img/icons_train.png';
import walkIcon from '../../img/icons_walk.png';
import directionLoadingIcon from '../../img/icons_loading.gif';
import triangleIcon from '../../img/icons_triangle.png';

const Directions = ({ index }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const dayTrack = useSelector(state => state.trip);
  const { tripId, trackId, pinList, directions } = dayTrack;
  const [directionInfo, setDirectionInfo] = useState(null);
  const [directionIcon, setDirectionIcon] = useState();
  const [openedDropdownMenu, setOpenedDropdownMenu] = useState(null);
  const [estimatedDirection, setEstimatedDirection] = useState([]);
  const [otherDirectionOptions, setOtherDirectionOptions] = useState([]);
  const mapValue = useContext(MapContext);
  const { map } = mapValue;
  const tripValue = useContext(TripContext);
  const { pinLatLng } = tripValue;
  const dropdownMenu = useRef();
  const travelMode = [
    { mode: 'DRIVING', icon: carIcon },
    { mode: 'TRANSIT', icon: trainIcon },
    { mode: 'WALKING', icon: walkIcon }
  ];
  const directionLoadingIconDisplay = (!estimatedDirection[index]) ? 'direction-fetching-icon' : 'display-none';
  // do not display the last arrow of pin
  const arrowDisplay = (index == pinList.length - 1 ) ? 'display-none' : 'arrow';

  useEffect(() => {
    if (map) {
      setEstimatedDirection([]);
      const directionsService = new google.maps.DirectionsService();
      for (let i = 0; i < pinLatLng.length-1; i++) {
        const directionRequest = {
          origin: pinLatLng[i],
          destination: pinLatLng[i+1],
          travelMode: dayTrack.directions[i],
          drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'pessimistic'
          },
          transitOptions: {
            modes: ['BUS', 'RAIL', 'SUBWAY', 'TRAIN', 'TRAM'],
            routingPreference: 'FEWER_TRANSFERS'
          },
        };
        directionsService.route(directionRequest, (result, status) => {
          if (status == 'OK') {
            const distance = result.routes[0].legs[0].distance.text;
            const duration = result.routes[0].legs[0].duration.text;
            setEstimatedDirection(origin => [...origin, `${distance}・${duration}`]);
          } else {
            setEstimatedDirection(current => [...current, 'No results']);
          }
        });
      }
    }
  }, [pinLatLng]);

  const showDirectionIcon = (directionMode) => {
    switch (directionMode) {
      case 'DRIVING':
        setDirectionIcon(carIcon);
        break;
      case 'TRANSIT':
        setDirectionIcon(trainIcon);
        break;
      case 'WALKING':
        setDirectionIcon(walkIcon);
        break;
      default:
        setDirectionIcon(walkIcon);
    }
  };

  useEffect(() => {
    if (estimatedDirection) {
      setDirectionInfo(estimatedDirection[index]);
      showDirectionIcon(directions[index]);
    }
  }, [estimatedDirection]);

  useEffect(() => {
    dropdownMenu.current.className = 'display-none';
    setOtherDirectionOptions([]);
  }, [trackIndex]);

  const switchDropdownModal = (e) => {
    if (!openedDropdownMenu) {
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
      getOtherDirections(e.target.parentNode.id);
    } else if(openedDropdownMenu == dropdownMenu.current) {
        setOtherDirectionOptions([]);
        setOpenedDropdownMenu(null);
        dropdownMenu.current.className = 'display-none';
    } else {
      setOtherDirectionOptions([]);
      openedDropdownMenu.className = 'display-none';
      dropdownMenu.current.className = 'dropdownModal';
      setOpenedDropdownMenu(dropdownMenu.current);
      getOtherDirections(e.target.parentNode.id);
    }
  }

  const getOtherDirections = (index) => {
    const directionsService = new google.maps.DirectionsService();
    const start = pinList[index].position;
    const end = pinList[parseInt(index)+1].position;
    let otherTravelMode;
    if (directions[index] == 'DRIVING') {
      otherTravelMode = travelMode.filter(item => item.mode != 'DRIVING');
    } else if (directions[index] == 'TRANSIT') {
      otherTravelMode = travelMode.filter(item => item.mode != 'TRANSIT');
    } else if (directions[index] == 'WALKING') {
      otherTravelMode = travelMode.filter(item => item.mode != 'WALKING');
    }
    otherTravelMode.forEach((item) => {
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
          setOtherDirectionOptions(current => [...current, {
            mode: item.mode,
            value: `${distance}・${duration}`,
            icon: item.icon
          }]);
        } else {
          setOtherDirectionOptions(current => [...current, {
            mode: item.mode,
            value: 'No results',
            icon: item.icon
          }]);
        }
      });
    });
  };

  const chooseAnotherDirectionOption = (e) => {
    const choice = otherDirectionOptions[e.target.id].mode;
    setDirectionInfo(otherDirectionOptions[e.target.id].value);
    showDirectionIcon(choice);
    const directionModes = [...directions];
    directionModes.splice(dropdownMenu.current.parentNode.id, 1, choice);
    dispatch(changeDirectionOptions({
      tripId: tripId,
      trackId: trackId,
      newDirections: directionModes
    }));
  };

  return (
    <div
      className={arrowDisplay}
      onClick={switchDropdownModal}
    >
      <div className='arrow-content' id={index}>
        <img className='path-icon' src={pathIcon}/>
        <img src={directionIcon} className='default-direction-icon'/>
        <img src={directionLoadingIcon} className={directionLoadingIconDisplay}/>
        <div className='direction'>{directionInfo}</div>
        <img src={triangleIcon} className='dropdown-icon'/>
        <div className='display-none' ref={dropdownMenu}>
          { 
            otherDirectionOptions.length == 0
            ? <img src={directionLoadingIcon} className='other-direction-fetching-icon'/>
            : (
              otherDirectionOptions.map((option, i) => {
                return (
                  <div className='other-direction-option'
                    key={i}
                    onClick={chooseAnotherDirectionOption}
                  >
                    <img src={option.icon} className='other-direction-icon'/>
                    <div id={i}
                      >{option.value}</div>
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

export default Directions;