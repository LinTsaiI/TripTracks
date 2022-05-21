import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { resetNewTrip } from '../../store/slice/newTripSlice';
import { fetchDayTrack, initTrackData, clearPinList, deletePin } from '../../store/slice/tripSlice';
import { getTripData, getTrackData, saveMap } from '../../API';
import Tracks from '../Tracks/Tracks';
import SearchBar from '../searchBar/searchBar';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';
import Footer from '../Footer/Footer';
import markerImg from '../../img/icons_marker.png';
import './Trip.css';
import trashCanIcon from '../../img/icons_trashcan.png';
import searchMarker from '../../img/icons_searchMarker.png';

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
  const newTrip = useSelector(state => state.newTrip);
  const dayTrack = useSelector(state => state.trip);
  const mapRegin = useRef();
  const [tripInfo, setTripInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [pinMarkerList, setPinMarkerList] = useState([]);
  const [pinLatLng, setPinLatLng] = useState([]);
  const [path, setPath] = useState(null);
  const [focusInfoWindow, setFocusInfoWindow] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
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
          console.log('map init')
          const center = trackData.mapCenter ? trackData.mapCenter : { lat: 23.247797913420555, lng: 119.4327646617118 };
          const zoom = trackData.zoom ? trackData.zoom : 3
          const map = new google.maps.Map(mapRegin.current, {
            mapId: '6fe2140f54e6c7b3',
            mapTypeControl: false,
            center: center,
            zoom: zoom
          });
          const marker = new google.maps.Marker({
            map: map,
            visible: false,
            icon: searchMarker
          });
          const infoWindow = new google.maps.InfoWindow();
          setMap(map);
          setMarker(marker);
          setInfoWindow(infoWindow);
          let markerList = [];
          let latLngList = [];
          trackData.pinList.forEach((pin, index) => {
            const markerOptions = {
              map: map,
              position: pin.position,
              icon: markerImg,
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
    if (map) {
      return () => {
        dispatch(clearPinList());
      }
    }
  }, [map]);

  useEffect(() => {
    if (tripInfo) {
      const mapCenter = map.getCenter();
      const zoom = map.getZoom();
      saveMap({
        tripId: tripId,
        trackId: dayTrack.trackId,
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
        zoom: zoom
      });
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
          icon: markerImg,
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
        unitSystem: google.maps.UnitSystem.METRIC,
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
      anchor: pinMarker,
      map: map,
      shouldFocus: true,
      maxWidth: 350
    });
  };

  if (tripInfo) {
    return (
      <div className='trip-container'>
        <div className={dataFetchingClassName}></div>
        <MapContext.Provider value={{
          map: map,
          marker: marker,
          infoWindow: infoWindow
        }}>
          <TripContext.Provider value={{
            pinMarkerList: pinMarkerList,
            isNoteOpen: isNoteOpen,
            setIsNoteOpen: setIsNoteOpen,
            isDirectionOpen: isDirectionOpen,
            setIsDirectionOpen: setIsDirectionOpen,
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
              <SearchBar setFocusInfoWindow={setFocusInfoWindow} />
              <Notes />
              <Direction />
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