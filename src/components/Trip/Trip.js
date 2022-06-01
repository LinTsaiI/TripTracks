import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { resetNewTrip } from '../../store/slice/dashboardSlice';
import { fetchDayTrack, initTrackData, clearPinList, deletePin } from '../../store/slice/tripSlice';
import { getTripData, getTrackData, saveMap } from '../../API';
import Tracks from '../Tracks/Tracks';
import Search from '../search/search';
import Notes from '../Notes/Notes';
import Footer from '../Footer/Footer';
import './Trip.css';
import pinMarker from '../../img/icons_marker.png';
import trashCanIcon from '../../img/icons_trashcan.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';
import defaultMarker from '../../img/icons_hotelMarker.png';
import star from '../../img/icons_star.png';

export const TripContext = createContext();
export const MapContext = createContext();
export const DirectionContext = createContext();

const Trip = () => {
  const params = useParams();
  const tripId = params.tripId;
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const dispatch = useDispatch();
  const newTrip = useSelector(state => state.dashboard);
  const dayTrack = useSelector(state => state.trip);
  const mapRegin = useRef();
  const [tripInfo, setTripInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [pinMarkerList, setPinMarkerList] = useState([]);
  const [pinLatLng, setPinLatLng] = useState([]);
  const [path, setPath] = useState(null);
  const [focusInfoWindow, setFocusInfoWindow] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [currentFocusNote, setCurrentFocusNote] = useState(null);
  const [openedDropdownMenu, setOpenedDropdownMenu] = useState(null);
  const [currentFocusDirection, setCurrentFocusDirection] = useState(null);
  const [estimatedDirection, setEstimatedDirection] = useState([]);
  const dataFetchingClassName = dayTrack.isFetching ? 'fetching-data' : 'display-none';
  const pathUpdatingClassName = dayTrack.isPathUpdating ? 'path-updating' : 'display-none';

  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    if (newTrip.isNewTrip) {
      dispatch(resetNewTrip());
    }
  }, []);

  useEffect(() => {
    getTripData(tripId)
      .then(tripData => {
        setTripInfo(tripData);
        return getTrackData(tripId, trackIndex);
      })
      .then(trackData => {
        dispatch(initTrackData(trackData));
        mapLoader.load().then(() => {
          const center = trackData.mapCenter ? trackData.mapCenter : { lat: 23.247797913420555, lng: 119.4327646617118 };
          const zoom = trackData.zoom ? trackData.zoom : 3
          const map = new google.maps.Map(mapRegin.current, {
            mapId: '6fe2140f54e6c7b3',
            mapTypeControl: false,
            keyboardShortcuts: false,
            center: center,
            zoom: zoom
          });
          const infoWindow = new google.maps.InfoWindow();
          setMap(map);
          setInfoWindow(infoWindow);
          let markerList = [];
          let latLngList = [];
          trackData.pinList.forEach((pin, index) => {
            const markerOptions = {
              map: map,
              position: pin.position,
              icon: pinMarker,
              label: {
                text: (index+1).toString(),
                className: 'marker-label',
                color: 'grey',
                fontWeight: 'bold'
              }
            }
            let marker = new google.maps.Marker(markerOptions);
            markerList.push(marker);
            latLngList.push(pin.position)
          });
          setPinMarkerList(markerList);
          setPinLatLng(latLngList);
        });
      });
  }, []);

  useEffect(() => {
    if (map) {
      return () => {
        dispatch(clearPinList());
      }
    }
  }, [map]);

  useEffect(() => {
    setEstimatedDirection([]);
    if (pinLatLng && map) {
      const pinPath = new google.maps.Polyline({
        path: pinLatLng,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 3,
      });
      setPath(pinPath);
      pinPath.setMap(map);
      getDirections();
    }
  }, [pinLatLng]);

  useEffect(() => {
    if (tripInfo) {
      const mapCenter = map.getCenter();
      const zoom = map.getZoom();
      path.setMap(null);
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
        setPinMarkerList(currentMarkerList);
      }
      dispatch(fetchDayTrack({
        tripId: tripId,
        trackIndex: trackIndex,
      }));
      return () => {
        saveMap({
          tripId: tripId,
          trackId: dayTrack.trackId,
          lat: mapCenter.lat(),
          lng: mapCenter.lng(),
          zoom: zoom
        });
      }
    }
  }, [trackIndex]);

  useEffect(() => {
    if (map) {
      map.setCenter(dayTrack.mapCenter);
      map.setZoom(dayTrack.zoom);
    }
  }, [dayTrack.mapCenter, dayTrack.zoom]);

  useEffect(() => {
    if (map && dayTrack.pinList) {
      path.setMap(null);
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
      }
      let markerList = [];
      let latLngList = [];
      dayTrack.pinList.forEach((pin, index) => {
        const markerOptions = {
          map: map,
          position: pin.position,
          icon: pinMarker,
          label: {
            text: (index+1).toString(),
            className: 'marker-label',
            color: 'grey',
            fontWeight: 'bold'
          }
        }
        let marker = new google.maps.Marker(markerOptions);
        markerList.push(marker);
        latLngList.push(pin.position);
      });
      setPinMarkerList(markerList);
      setPinLatLng(latLngList);
    }
  }, [dayTrack.pinList]);

  useEffect(() => {
    if (pinMarkerList) {
      pinMarkerList.forEach((pinMarker, index) => {
        pinMarker.addListener('click', () => {
          showPinInfoWindow(pinMarker, index);
        });
      });
    }
  }, [pinMarkerList]);

  useEffect(() => {
    if (focusInfoWindow) {
      return () => {
        google.maps.event.removeListener(focusInfoWindow);
      }
    }
  }, [focusInfoWindow]);

  const getDirections = () => {
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
  };

  const showPinInfoWindow = (pinMarker, index) => {
    map.panTo(dayTrack.pinList[index].position);
    let infoWindowListener = infoWindow.addListener('domready', () => {
      const deleteBtn = document.getElementById('deleteBtn');
      deleteBtn.addEventListener('click', () => {
        const restPinIds = [...dayTrack.pinIds];
        restPinIds.splice(index, 1);
        const newDirectionOptions = [...dayTrack.directions];
        const directionOptionRemoveTarget = (index == dayTrack.pinList.length) ? index - 1 : index;
        newDirectionOptions.splice(directionOptionRemoveTarget, 1);
        dispatch(deletePin({
          tripId: tripId,
          trackId: dayTrack.trackId,
          pinId: dayTrack.pinIds[index],
          restPinIds: restPinIds,
          newDirections: newDirectionOptions
        }));
        infoWindow.close();
      });
    });
    setFocusInfoWindow(infoWindowListener);

    const placeName = dayTrack.pinList[index].name;
    const address = dayTrack.pinList[index].address;
    const photo = dayTrack.pinList[index].photo;
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
      <div class='infoWindow-container'>
        <div class='infoWindow-upper'>
          <div class='infoWindow-upper-left'>
            <h2>${placeName}</h2>
            <div class='infoWindow-upper-left-type'>
              <img src=${icon}>
              <div class='infoWindow-upper-left-type'>${displayType}</div>
            </div>
            <h4>${address}</h4>
          </div>
          <img src=${photo} class='infoWindow-upper-right'/>
        </div>
        <div class='infoWindow-bottom'>
          <div>
            <div class='infoWindow-bottom-rating'>
              <div></div>
              <p>${rating} ${voteNumber}</p>
            </div>
            <a style='color: #313131' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}' target='_blank'>Find on google map</a>
          </div>
          <div id='deleteBtn' class='infoWindow-bottom-trashcan'></div>
        </div>
      </div>
    `);
    infoWindow.open({
      anchor: pinMarker,
      map: map,
      shouldFocus: true,
      maxWidth: 300,
      minWidth: 250
    });
  };

  if (tripInfo) {
    return (
      <div className='trip-container'>
        <div className={dataFetchingClassName}></div>
        <MapContext.Provider value={{
          map: map,
          infoWindow: infoWindow
        }}>
          <TripContext.Provider value={{
            pinMarkerList: pinMarkerList,
            isNoteOpen: isNoteOpen,
            setIsNoteOpen: setIsNoteOpen,
            currentFocusNote: currentFocusNote,
            setCurrentFocusNote: setCurrentFocusNote,
            openedDropdownMenu: openedDropdownMenu,
            setOpenedDropdownMenu: setOpenedDropdownMenu,
            currentFocusDirection: currentFocusDirection,
            setCurrentFocusDirection: setCurrentFocusDirection,
            setPinMarkerList: setPinMarkerList,
            setFocusInfoWindow: setFocusInfoWindow
          }}>
            <DirectionContext.Provider value={{
              estimatedDirection: estimatedDirection,
              setEstimatedDirection: setEstimatedDirection,
            }}>
              <Tracks tripInfo={tripInfo} setFocusInfoWindow={setFocusInfoWindow} />
              <Search setFocusInfoWindow={setFocusInfoWindow} />
              <Notes />
            </DirectionContext.Provider>
          </TripContext.Provider>
          <div className='map-region'>
            <div className={pathUpdatingClassName}/>
            <div className='map' ref={mapRegin}/>
          </div>          
        </MapContext.Provider>
        <Footer />
      </div>
    );
  }
}

export default Trip;