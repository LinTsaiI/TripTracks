import React, { useState, useRef, useEffect } from 'react';
import './Map.css';

const Map = ({mapCenter, onMapLoad}) => {
  const mapRegin = useRef();
  let map;
  const onScriptLoad = () => {
    map = new window.google.maps.Map(mapRegin.current, {
      mapId: '6fe2140f54e6c7b3',
      center: mapCenter,
      zoom: 15
    });
    onMapLoad(mapCenter, map);
  }
  useEffect(() => {
    if(!window.google) {
      let mapScript = document.createElement('script');
      mapScript.type = 'text/javascript';
      mapScript.src = process.env.GOOGLE_MAP_API_URL;
      mapScript.async = true;
      let head = document.getElementsByTagName('head')[0];
      head.appendChild(mapScript);
      mapScript.addEventListener('load', () => {
        onScriptLoad();
      })
    } else {
      onScriptLoad();
    }
  }, [])

  return(
    <div ref={mapRegin} id='map'/>
  )
}

export default Map;