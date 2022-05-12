import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContext, TripContext } from '../Trip/Trip';
import { addNewPin } from '../../store/slice/tripSlice';
import Pin from './Pin';
import pinImg from '../../img/icons_google.png';
import './Tracks.css';

const Tracks = ({ setFocusInfoWindow }) => {
  const [input, setInput] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const trackId = useSelector(state => state.trip.trackId);
  const dispatch = useDispatch();
  const mapValue = useContext(MapContext);
  const { map, marker, infoWindow } = mapValue;
  const tripValue = useContext(TripContext);
  const { setIsNoteOpen, setIsDirectionOpen } = tripValue;
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

  useEffect(() => {
    if (marker) {
      infoWindow.close();
      marker.addListener('click', () => {
        showInfoWindow();
      });
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
          setIsNoteOpen(false);
          setIsDirectionOpen(false);
          marker.setVisible(false);
        });
      });
      setFocusInfoWindow(infoWindowListener);
      return () => {
        google.maps.event.removeListener(infoWindowListener);
      }
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
  };

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
  };

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
  };

  return (
    <div className='tracks-container'>
      <div className='search-input-block'>
        <input type='text' className='search-input' onChange={(e) => setInput(e.target)}/>
        <input type='button' className='search-button' onClick={() => searchPlace()}/>
      </div>
      <Pin/>
    </div>
  );
};

export default Tracks;