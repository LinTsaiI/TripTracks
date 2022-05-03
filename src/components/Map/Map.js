import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDayTrack, updateDayTrack } from '../../store/slice/tripSlice';
import { getTrackData, addToPinList } from '../../API';
import { Loader } from '@googlemaps/js-api-loader';
import Tracks from '../Tracks/Tracks';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';
import pin from '../../img/icons_google.png';
import './Map.css';

const Map = () => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const index = day ? day-1 : 0;
  const tripData = useSelector(state => state.trip.tripData);
  const trackId = useSelector(state => state.trip.trackId);
  const dispatch = useDispatch();
  const mapRegin = useRef();
  const [mapCenter, serMapCenter] = useState({ lat: 23.247797913420555, lng: 119.4327646617118 });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  
  useEffect(() => {
    getTrackData(tripData.trackId[index])
      .then(dayTrack => {
        dispatch(setDayTrack({
          trackId: tripData.trackId[index],
          dayTrack: dayTrack
        }));
      });
  });

  useEffect(() => {
    const mapLoader = new Loader({
      apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
      libraries: ['places']
    });
    mapLoader.load().then(() => {
      console.log('init')
      let map = new google.maps.Map(mapRegin.current, {
        mapId: '6fe2140f54e6c7b3',
        mapTypeControl: false,
        center: mapCenter,
        zoom: 3
      });
      let marker = new google.maps.Marker({
        map: map,
        position: mapCenter,
        visible: false
      });
      let infoWindow = new google.maps.InfoWindow();
      setMap(map);
      setMarker(marker);
      setInfoWindow(infoWindow);
    });
  }, []);

  useEffect(() => {
    if (marker) {
      marker.addListener('click', () => {
        showInfoWindow();
      });
      google.maps.event.addListener(infoWindow, 'domready', () => {
        const addBtn = document.getElementById('addBtn');
        const renderNewDayTrack = (newDayTrack) => {
          addBtn.disabled = true;
          dispatch(updateDayTrack({
            dayTrack: newDayTrack
          }));
        }
        addBtn.addEventListener('click', () => {
          addToPinList(trackId, placeInfo.name, placeInfo.geometry.location.lat(), placeInfo.geometry.location.lng(), renderNewDayTrack);
        });
      });
    }
  }, [placeInfo]);

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
    <div className='map'>
      <div>This is {tripData.tripName}'s Day{index+1} Map</div>
      <Tracks map={map} showMarker={showMarker} setPlaceInfo={setPlaceInfo} closeInfoWindow={closeInfoWindow} />
      <Notes />
      <Direction />
      <div className='map-region' ref={mapRegin} />
    </div>
  );
}

export default Map;
