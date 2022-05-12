import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { setTrackId, fetchDayTrack, initTrackDate, updateMapCenter, deletePin } from '../../store/slice/tripSlice';
import { getTripData, getTrackData } from '../../API';
import TripHeader from './TripHeader';
import Footer from '../Footer/Footer';
import Tracks from '../Tracks/Tracks';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';
import pinImg from '../../img/icons_google.png';

import './Trip.css';

export const TripContext = createContext();
export const MapContext = createContext();

const Trip = () => {
  const params = useParams();
  const tripId = params.tripId;
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  // const trackId = tripInfo.trackId[trackIndex];

  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  const mapRegin = useRef();
  const [tripInfo, setTripInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [pinMarkerList, setPinMarkerList] = useState([]);
  const [focusInfoWindow, setFocusInfoWindow] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const [currentFocusNote, setCurrentFocusNote] = useState(null);
  const [currentFocusDirection, setCurrentFocusDirection] = useState(null);

  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    getTripData(tripId)
      .then(tripData => {
        setTripInfo(tripData);
        dispatch(setTrackId(tripData.trackId[trackIndex]));
        return getTrackData(tripData.trackId[trackIndex]);
      })
      .then(trackData => {
        dispatch(initTrackDate(trackData));
        mapLoader.load().then(() => {
          console.log('map init')
          const mapCenter = trackData.mapCenter ? trackData.mapCenter : { lat: 23.247797913420555, lng: 119.4327646617118 };
          const zoom = trackData.zoom ? trackData.zoom : 3
          let map = new google.maps.Map(mapRegin.current, {
            mapId: '6fe2140f54e6c7b3',
            mapTypeControl: false,
            center: mapCenter,
            zoom: zoom
          });
          let marker = new google.maps.Marker({
            map: map,
            visible: false
          });
          let infoWindow = new google.maps.InfoWindow();
          setMap(map);
          setMarker(marker);
          setInfoWindow(infoWindow);
          let markerList = [];
          trackData.pinList.forEach((pin, index) => {
            const markerOptions = {
              map: map,
              position: pin.position,
              icon: pinImg
            }
            let marker = new google.maps.Marker(markerOptions);
            // marker.addListener('click', () => {
            //   showInfoWindow(pin, index, map, marker, infoWindow, trackData);
            // });
            markerList.push(marker);
          });
          setPinMarkerList(markerList);
        });
      });
  }, []);

  useEffect(() => {
    if (tripInfo) {
      console.log('fetch different dayTrack');
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
        setPinMarkerList(currentMarkerList);
      }
      dispatch(setTrackId(tripInfo.trackId[trackIndex]));
      dispatch(fetchDayTrack(tripInfo.trackId[trackIndex]));
      setIsNoteOpen(false);
      setCurrentFocusNote(null);
      setIsDirectionOpen(false);
      setCurrentFocusDirection(null);
      // google.maps.event.removeListener(infoWindowListener);
    }
  }, [trackIndex]);

  useEffect(() => {
    if (map) {
      map.setCenter(dayTrack.mapCenter);
      map.setZoom(dayTrack.zoom);
    }
  }, [dayTrack.mapCenter]);

  useEffect(() => {
    if (map && dayTrack.pinList) {
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
      }
      let markerList = [];
      dayTrack.pinList.forEach(pin => {
        const markerOptions = {
          map: map,
          position: pin.position,
          icon: pinImg
        }
        let marker = new google.maps.Marker(markerOptions);
        markerList.push(marker);
      });
      setPinMarkerList(markerList);
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

  const showPinInfoWindow = (pinMarker, index) => {
    map.panTo(dayTrack.pinList[index].position);
    let infoWindowListener = infoWindow.addListener('domready', () => {
      const deleteBtn = document.getElementById('deleteBtn');
      deleteBtn.addEventListener('click', () => {
        dispatch(deletePin({
          trackId: dayTrack.trackId,
          pinId: dayTrack.pinId[index],
          targetIndex: index
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
          <div style='width: 40%; margin: 10px; background: #ffffff url("${dayTrack.pinList[index].photo}") no-repeat center center; background-size: cover'></div>
        </div>
        <button style='cursor: pointer; float: right' id='deleteBtn'>Delete</button>
      </div>
    `);
    infoWindow.open({
      anchor: pinMarker,
      map: map,
      shouldFocus: true,
      maxWidth: 350
    });
  };

  return !tripInfo ? <div>Loading...</div> : (
    <div>
      <TripHeader tripInfo={tripInfo} />
      <MapContext.Provider value={{
        map: map,
        marker: marker,
        infoWindow: infoWindow
      }}>
        <div className='map'>
          <TripContext.Provider value={{
            isNoteOpen: isNoteOpen,
            setIsNoteOpen: setIsNoteOpen,
            isDirectionOpen: isDirectionOpen,
            setIsDirectionOpen: setIsDirectionOpen,
            currentFocusNote: currentFocusNote,
            setCurrentFocusNote: setCurrentFocusNote,
            currentFocusDirection: currentFocusDirection,
            setCurrentFocusDirection: setCurrentFocusDirection,
            pinMarkerList: pinMarkerList,
            setPinMarkerList: setPinMarkerList
          }}>
            <Tracks setFocusInfoWindow={setFocusInfoWindow}/>
            <Notes />
            <Direction />
          </TripContext.Provider>
          {/* <Outlet context={tripInfo} /> */}
          <div className='map-region' ref={mapRegin}/>
        </div>
      </MapContext.Provider>
      <Footer />
    </div>
  );
}

export default Trip;