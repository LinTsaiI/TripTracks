import React, { useState, useEffect } from 'react';
import SearchBar from './searchBar';
import Pin from './Pin';
import './Tracks.css';

const Tracks = ({ map, showMarker }) => {
  const [input, setInput] = useState('');
  const options = {
    fields: ['geometry'],
    strictBounds: false,
    types: ['establishment'],
  };

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(input, options);
      autocomplete.bindTo('bounds', map);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        showMarker(place.geometry.location);
      });
    }
  }, [input])

  return (
    <div className='tracks-container'>
      <SearchBar onInputChange={setInput}/>
      <Pin />
    </div>
  )
}

export default Tracks;

// Map上左手邊視窗，包含搜尋框，加入行程顯示