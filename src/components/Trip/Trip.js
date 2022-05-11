import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet, useSearchParams, useLocation } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { setTrackId, fetchDayTrack, initTrackDate, updateMapCenter } from '../../store/slice/tripSlice';
import { hideNotes } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import { getTripData, getTrackData } from '../../API';
import MapContent from '../MapContent/MapContent';
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
  const [pinMarkerList, setPinMarkerList] = useState(null);

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
          trackData.pins.forEach(pin => {
            const markerOptions = {
              map: map,
              position: pin.position,
              icon: pinImg
            }
            let marker = new google.maps.Marker(markerOptions);
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
        console.log('change day, remove previous markers: ', pinMarkerList)
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
        setPinMarkerList(currentMarkerList);
      }
      dispatch(setTrackId(tripInfo.trackId[trackIndex]));
      dispatch(fetchDayTrack(tripInfo.trackId[trackIndex]));
      setIsNoteOpen(false);
      setIsDirectionOpen(false);
    }
  }, [trackIndex]);

  useEffect(() => {
    if (map) {
      console.log('set map center')
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
      console.log('new pinList: ', markerList)
    }
  }, [dayTrack.pinList]);

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
            <Tracks />
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