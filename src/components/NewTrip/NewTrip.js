import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { asyncCreateNewTrip } from '../../store/slice/dashboardSlice';
import './NewTrip.css';

const getDate = (daysFromToday) => {
  let today = new Date();
  let date = new Date(today.setDate(today.getDate() + daysFromToday));
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  (mm < 10) ? mm = '0' + mm : mm;
  (dd < 10) ? dd = '0' + dd : dd;
  let displayDate = yyyy + '-' + mm + '-' + dd;
  return displayDate;
};

const NewTrip = ({ openModal }) => {
  const userId = useSelector(state => state.user.userId);
  const mapRegion = useRef();
  const [map, setMap] = useState(null);
  const currentDate = getDate(0);
  const defaultEndDate = getDate(2);
  const [inputTarget, setInputTarget] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState('');
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newTrip = useSelector(state => state.dashboard);
  const autocompleteOptions = {
    strictBounds: false,
    types: ['country', 'locality', 'sublocality'],
  };

  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    if (newTrip.isNewTrip) {
      navigate(`/trip/${newTrip.newtTripId}`);
      openModal(false);
    }
  }, [newTrip.isNewTrip]);

  useEffect(() => {
    mapLoader.load().then((google) => {
      const map = new google.maps.Map(mapRegion.current);
      setMap(map);
    });
  }, []);

  useEffect(() => {
    if (map && inputTarget) {
      const autocomplete = new google.maps.places.Autocomplete(inputTarget, autocompleteOptions);
      autocomplete.addListener('place_changed', () => {
        setDestination(inputTarget.value);
      });
    }
  }, [inputTarget]);

  useEffect(() => {
    if (map && destination) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: destination })
        .then(result => {
          setDestinationLatLng(result.results[0].geometry.location);
        })
    }
  }, [destination]);

  useEffect(() => {
    if (destination && tripName) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [tripName]);
  
  const handelSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncCreateNewTrip({
      userId: userId,
      destination: destination,
      destinationLatLng: { lat: destinationLatLng.lat(), lng: destinationLatLng.lng() },
      tripName: tripName,
      startDate: startDate,
      endDate: endDate
    }));
  };

  return (
    <div className='modal'>
      <div className='modal-main'>
        <div className='create-form-name'>Plan A New Trip</div>
        <div onClick={() => openModal(false)} className='close-btn'>&#215;</div>
        <form className='create-form' onSubmit={handelSubmit}>
          <div className='create-form-input'>
            <label htmlFor='trip-name' className='label-value'>Destination</label>
            <input type='text' id='trip-destination' placeholder='Choose a destination e.g country/city...'  onClick={(e) => setInputTarget(e.target)}/>
          </div>
          <div className='create-form-input'>
            <label htmlFor='trip-name' className='label-value'>Trip Name</label>
            <input type='text' id='trip-name' placeholder='Give a name to your trip!' onChange={e => setTripName(e.target.value)}/>
          </div>
          <div className='create-form-input'>
            <label htmlFor='start-date' className='label-value'>Start Date</label>
            <input type='date' id='start-date' placeholder='Start from' defaultValue={currentDate} onChange={e => setStartDate(e.target.value)}/>
          </div>
          <div className='create-form-input'>
            <label htmlFor='end-date' className='label-value'>End Date</label>
            <input type='date' id='end-date' placeholder='End on' defaultValue={defaultEndDate} onChange={e => setEndDate(e.target.value)}/>
          </div>
          <input type='submit' value='Start to Plan' className='create-btn' disabled={disabled}/>
        </form>
        <div ref={mapRegion}></div>
      </div>
    </div>
  )
}

export default NewTrip;