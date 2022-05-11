import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { useSearchParams, useLocation, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTrackId, fetchDayTrack, addNewPin, updateMapCenter } from '../../store/slice/tripSlice';
import { Loader } from '@googlemaps/js-api-loader';
import { MapContext } from '../Trip/Trip';
import Tracks from '../Tracks/Tracks';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';
import pinImg from '../../img/icons_google.png';
// import './MapContent.css';

export const MapContentContext = createContext();

const MapContent = () => {
  const tripInfo = useOutletContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const index = day ? day-1 : 0;
  const trackId = tripInfo.trackId[index];
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  // const [mapCenter, serMapCenter] = useState({ lat: 23.247797913420555, lng: 119.4327646617118 });
  // const [map, setMap] = useState(null);
  // const [marker, setMarker] = useState(null);
  // const [infoWindow, setInfoWindow] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [pinMarkerList, setPinMarkerList] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const [currentFocusNote, setCurrentFocusNote] = useState(null);
  const [currentFocusDirection, setCurrentFocusDirection] = useState(null);
  const value = useContext(MapContext);
  const { map, marker, infoWindow } = value;
  
  useEffect(() => {
    console.log('track data load, now is in: ', trackId);
    dispatch(setTrackId(trackId));
    dispatch(fetchDayTrack(trackId));
    if (pinMarkerList) {
      let currentMarkerList = [...pinMarkerList];
      currentMarkerList.forEach(marker => {
        marker.setMap(null);
      });
    }
  }, [trackId]);

  useEffect(() => {
    if (dayTrack.pinList) {
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
    if (marker) {
      marker.addListener('click', () => {
        showInfoWindow();
      });
      closeInfoWindow();
      let infoWindowListener = infoWindow.addListener('domready', () => {
        const addBtn = document.getElementById('addBtn');
        addBtn.addEventListener('click', () => {
          dispatch(addNewPin({
            trackId: trackId,
            placeName: placeInfo.name,
            lat: placeInfo.geometry.location.lat(),
            lng: placeInfo.geometry.location.lng(),
            address: placeInfo.formatted_address,
            photo: placeInfo.photos[0].getUrl()
          }));
          marker.setVisible(false);
          new google.maps.Marker({
            map: map,
            position: placeInfo.geometry.location,
            icon: pinImg
          });
        });
      });
      return () => {
        google.maps.event.removeListener(infoWindowListener);
      }
    }
  }, [placeInfo]);

  useEffect(() => {
    if (map) {
      const mapCenter = map.getCenter();
      dispatch(updateMapCenter({
        trackId: trackId,
        lat: mapCenter.lat(),
        lng: mapCenter.lng(),
        zoom: map.getZoom()
      }));
    }
  }, [location]);

  const showMarker = (position) => {
    if(!marker.getVisible()) {
      map.setCenter(position);
      map.setZoom(14);
      marker.setPosition(position);
      marker.setVisible(true);
    } else if (map.getBounds().contains(position)) {
      marker.setVisible(false);
      map.panTo(position);
      marker.setPosition(position);
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
      map.setZoom(13);
      setTimeout(() => {
        map.setCenter(position);
        map.setZoom(14);
        marker.setPosition(position);
        marker.setVisible(true);
      }, 500)
    }
  }

  const showInfoWindow = () => {
    map.panTo(placeInfo.geometry.location);
    infoWindow.setContent(`
      <div style='width: 300px'>
        <div style='width: 100%; display: flex'>
          <div style='width: 60%'>
            <h2>${placeInfo.name}</h2>
            <h5>${placeInfo.formatted_address}</h5>
          </div>
          <div style='width: 40%; margin: 10px; background: #ffffff url("${placeInfo.photos[0].getUrl()}") no-repeat center center; background-size: cover'></div>
        </div>
        <button style='cursor: pointer; float: right' id='addBtn'>Add to List</button>
      </div>
    `);
    infoWindow.open({
      anchor: marker,
      map: map,
      shouldFocus: true,
      maxWidth: 350
    });
  }

  const closeInfoWindow = () => {
    infoWindow.close();
  }

  return (
    <div>
      <div>This is {tripInfo.tripName}'s Day{index+1} Map</div>
      <MapContentContext.Provider value={{
        isNoteOpen: isNoteOpen,
        setIsNoteOpen: setIsNoteOpen,
        isDirectionOpen: isDirectionOpen,
        setIsDirectionOpen: setIsDirectionOpen,
        currentFocusNote: currentFocusNote,
        setCurrentFocusNote: setCurrentFocusNote,
        currentFocusDirection: currentFocusDirection,
        setCurrentFocusDirection: setCurrentFocusDirection
      }}>
        <Tracks showMarker={showMarker} setPlaceInfo={setPlaceInfo} />
        <Notes />
        <Direction />
      </MapContentContext.Provider>
    </div>
  );
}

export default MapContent;
