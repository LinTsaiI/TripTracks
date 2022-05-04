import React, { useState, useRef, useEffect } from 'react';

const GoogleMap = ({ setMap, setMarker }) => {
  const mapRegin = useRef();
  const mapCenter = { lat: 35.6879191, lng: 139.7206805 }

  const onScriptLoad = () => {
    let map = new window.google.maps.Map(mapRegin.current, {
      mapId: '6fe2140f54e6c7b3',
      mapTypeControl: false,
      center: mapCenter,
      zoom: 13
    });
    setMap(map);
    let marker = new window.google.maps.Marker({
      map,
      visible: false
    })
    setMarker(marker);
  }

  useEffect(() => {
    if(!window.google) {
      console.log('insert')
      let mapScript = document.createElement('script');
      mapScript.type = 'text/javascript';
      mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_GOOGLE_MAP_API_KEY}&libraries=places`;
      window.document.body.appendChild(mapScript);
      mapScript.addEventListener('load', () => {
        onScriptLoad();
      })
    } else {
      console.log('not insert')
      onScriptLoad();
    }
  }, [])

  return (
    <div className='map-region' ref={mapRegin} />
  );
}

export default GoogleMap;