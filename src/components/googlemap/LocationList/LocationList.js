import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import Location from '../Location/Location';
import './LocationListSideBar.css';

const LocationList = ({map, showMarker}) => {
  const [input, setInput] = useState('');
  const autoCompleteKeyword = (input) => {
    const inputField = input;
    const options = {
      fields: ['address_components', 'geometry', 'icon', 'name'],
      strictBounds: false,
      types: ['establishment'],
    };
    // const autocomplete = new window.google.maps.places.Autocomplete(inputField, options);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      showMarker(place.geometry.location);
    })
  }

  return(
    <div className='location-list-container'>
      <SearchBar onInputChange={autoCompleteKeyword}/>
      <Location />
      <Location />
    </div>
  )
}

export default LocationList;