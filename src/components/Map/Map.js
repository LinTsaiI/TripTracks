import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDayTrack } from '../../store/slice/tripSlice';
import { getTrackData } from '../../API';
import Tracks from '../Tracks/Tracks';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';
import './Map.css';

const Map = () => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const index = day ? day-1 : 0;
  const tripData = useSelector(state => state.trip.tripData);
  const dispatch = useDispatch();
  const mapRegin = useRef();
  const mapCenter = { lat: 23.247797913420555, lng: 119.4327646617118 }
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    getTrackData(tripData.trackId[index])
      .then(dayTrack => {
        dispatch(setDayTrack({
          dayTrack: dayTrack
        }));
      });
  });

  const onScriptLoad = () => {
    let map = new window.google.maps.Map(mapRegin.current, {
      mapId: '6fe2140f54e6c7b3',
      mapTypeControl: false,
      center: mapCenter,
      zoom: 7
    });
    setMap(map);
    let marker = new window.google.maps.Marker({
      map,
      visible: false
    })
    setMarker(marker);
  }

  // useEffect(() => {
  //   if(!window.google) {
  //     let mapScript = document.createElement('script');
  //     mapScript.type = 'text/javascript';
  //     mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_GOOGLE_MAP_API_KEY}&libraries=places`;
  //     window.document.body.appendChild(mapScript);
  //     mapScript.addEventListener('load', () => {
  //       onScriptLoad();
  //     })
  //   } else {
  //     onScriptLoad();
  //   }
  // }, []);

  const showMarker = (position) => {
    if(!marker.getVisible()) {
      map.setCenter(position);
      map.setZoom(14);
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

  return (
    <div className='map'>
      <div>This is {tripData.tripName}'s Day{index+1} Map</div>
      <Tracks map={map} showMarker={showMarker}/>
      <Notes />
      <Direction />
      <div className='map-region' ref={mapRegin} />
    </div>
  );
}

export default Map;
