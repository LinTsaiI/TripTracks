import React, { useState, useRef, useEffect } from 'react';
import LocationList from '../LocationList/LocationList';
import './Map.css';

const Map = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRegin = useRef();
  const center = { lat: 35.6879191, lng: 139.7206805 }
  const onScriptLoad = () => {
    let map = new window.google.maps.Map(mapRegin.current, {
      mapId: '1a89d2f234549565',
      mapTypeControl: false,
      center: center,
      zoom: 13
    });
    setMap(map);
    let marker = new window.google.maps.Marker({
      map,
      visible: false
    })
    setMarker(marker);
  }

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
  // Map init
  // useEffect(() => {
  //   if(!window.google) {
  //     let mapScript = document.createElement('script');
  //     mapScript.type = 'text/javascript';
  //     mapScript.src = process.env.GOOGLE_MAP_API_URL;
  //     mapScript.defer = true;
  //     let head = document.getElementsByTagName('head')[0];
  //     head.appendChild(mapScript);
  //     mapScript.addEventListener('load', () => {
  //       onScriptLoad();
  //     })
  //   } else {
  //     onScriptLoad();
  //   }
  // }, [])

  return (
    <div>
      <LocationList map={map} showMarker={showMarker}/>
      <div ref={mapRegin} id='map'/>
    </div>
  )
}

export default Map;