import React, { useState, useEffect, useContext } from 'react';
import { MapContext } from '../Trip/Trip';
import SearchBar from './searchBar';
import Pin from './Pin';
import './Tracks.css';

const Tracks = ({ showMarker, setPlaceInfo }) => {
  const [input, setInput] = useState(null);
  const value = useContext(MapContext);
  const map = value.map;
  const placeReturnField = ['name', 'geometry', 'formatted_address', 'photos'];
  const autocompleteOptions = {
    fields: placeReturnField,
    strictBounds: false,
    types: ['establishment'],
  };

  useEffect(() => {
    setTimeout(() => {
      if (map) {
        let autocomplete = new window.google.maps.places.Autocomplete(input, autocompleteOptions);
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setPlaceInfo(place);
          showMarker(place.geometry.location);
        });
        console.log('place request')
      }
    }, 1500);
  }, [input]);

  const searchPlace = () => {
    const service = new google.maps.places.PlacesService(map);
    let request = {
      query: input.value,
      fields: placeReturnField,
    };
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaceInfo(results[0]);
        showMarker(results[0].geometry.location);
      }
    });
  }

  return (
    <div className='tracks-container'>
      <SearchBar onInputChange={setInput} onSearchClick={searchPlace}/>
      <Pin/>
    </div>
  )
}

export default Tracks;

// Map上左手邊視窗，包含搜尋框，加入行程顯示