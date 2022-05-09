import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { fetchDayTrack, setTripData, savePreviousTrackState } from '../../store/slice/tripSlice';
import { hideNotes } from '../../store/slice/notesSlice';
import { hideDirection } from '../../store/slice/directionSlice';
import { getTripData } from '../../API';
import MapContent from '../MapContent/MapContent';
import TripHeader from './TripHeader';
import Footer from '../Footer/Footer';
import './Trip.css';

export const MapContext = createContext();

const Trip = () => {
  const params = useParams();
  const tripId = params.tripId;
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip);
  const mapRegin = useRef();
  const [tripInfo, setTripInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    getTripData(tripId)
      .then(tripData => {
        // dispatch(setTripData({
        //   tripData: tripData
        // }));
        setTripInfo(tripData);
      })
      .then(() => {
        mapLoader.load().then(() => {
          console.log('init')
          let map = new google.maps.Map(mapRegin.current, {
            mapId: '6fe2140f54e6c7b3',
            mapTypeControl: false,
            center: dayTrack.mapCenter,
            zoom: dayTrack.zoom
          });
          let marker = new google.maps.Marker({
            map: map,
            visible: false
          });
          let infoWindow = new google.maps.InfoWindow();
          setMap(map);
          setMarker(marker);
          setInfoWindow(infoWindow);
        });
      });
  }, [tripId]);

  return !tripInfo ? <div>Loading...</div> : (
    <div>
      <TripHeader tripInfo={tripInfo} />
      <MapContext.Provider value={{
        map: map,
        marker: marker,
        infoWindow: infoWindow
      }}>
        <div className='map'>
          <MapContent tripInfo={tripInfo} />
          <div className='map-region' ref={mapRegin}/>
        </div>
      </MapContext.Provider> 
      <Footer />
    </div>
  );
}

export default Trip;