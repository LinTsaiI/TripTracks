import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContext, TripContext } from '../Trip/Trip';
import { addNewPin } from '../../store/slice/tripSlice';
import './SearchBar.css';
import addPinIcon from '../../img/icons_pin2.png';
import drawingIcon from '../../img/icons_drawing.png';
import eraserIcon from '../../img/icons_eraser.png';
import searchMarker from '../../img/icons_hotelPin.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';


const SearchBar = ({ setFocusInfoWindow }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputTarget, setInputTarget] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [area, setArea] = useState(null);
  const [drawingAreaMarkers, setDrawingAreaMarkers] = useState([]);
  const [isDrawBtnDisabled, setIsDrawBtnDisabled] = useState(true);
  const [drawingOption, setDrawingOption] = useState(null);
  const checkedOption = useRef();
  const [focusedDrawingAreaMarker, setFocusedDrawingAreaMarker] = useState(null);
  const drawingClassName = isDrawing ? 'display-none' : 'draw-btn';
  const stopDrawingClassName = isDrawing ? 'draw-btn' : 'display-none';
  const dayTrack = useSelector(state => state.trip);
  const dispatch = useDispatch();
  const mapValue = useContext(MapContext);
  const { map, marker, infoWindow } = mapValue;
  const tripValue = useContext(TripContext);
  const { setIsNoteOpen, setIsDirectionOpen } = tripValue;
  const placeReturnField = ['name', 'types', 'geometry', 'formatted_address', 'photos', 'place_id', 'rating', 'user_ratings_total'];
  const autocompleteOptions = {
    fields: placeReturnField,
    strictBounds: false,
    types: ['establishment'],
  };

  useEffect(() => {
    setTimeout(() => {
      if (map) {
        let autocomplete = new window.google.maps.places.Autocomplete(inputTarget, autocompleteOptions);
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', () => {
          setInputTarget(current => current.value = '');
          setInputValue('');
          const place = autocomplete.getPlace();
          setPlaceInfo(place);
          showMarker(place.geometry.location);
        });
      }
    }, 1500);
  }, [inputTarget]);

  useEffect(() => {
    const focusedMarker = focusedDrawingAreaMarker ? focusedDrawingAreaMarker : marker;
    if (focusedMarker) {
      infoWindow.close();
      focusedMarker.addListener('click', () => {
        console.log(placeInfo)
        showInfoWindow();
      });
      let infoWindowListener = infoWindow.addListener('domready', () => {
        const addBtn = document.getElementById('addBtn');
        addBtn.addEventListener('click', () => {
          const newDirectionOptions = [...dayTrack.directions, 'DRIVING'];
          dispatch(addNewPin({
            tripId: dayTrack.tripId,
            trackId: dayTrack.trackId,
            currentPinListLength: dayTrack.pinList.length,
            placeName: placeInfo.name,
            lat: placeInfo.geometry.location.lat(),
            lng: placeInfo.geometry.location.lng(),
            address: placeInfo.formatted_address,
            photo: placeInfo.photos[0].getUrl(),
            newDirections: newDirectionOptions
          }));
          setIsNoteOpen(false);
          setIsDirectionOpen(false);
          focusedMarker.setVisible(false);
          infoWindow.close();
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
    const placeName = placeInfo.name;
    const address = placeInfo.formatted_address ? placeInfo.formatted_address : placeInfo.vicinity;
    const photo = placeInfo.photos[0].getUrl();
    const place_id = placeInfo.place_id;
    const rating = placeInfo.rating;
    const voteNumber = placeInfo.user_ratings_total ? `(${placeInfo.user_ratings_total})` : '';
    let type;
    let icon;
    switch (drawingOption) {
      case 'tourist_attraction':
        type = 'Attraction';
        icon = attractionIcon;
        break;
      case 'restaurant':
        type = 'Restaurant';
        icon = restaurantIcon;
        break;
      case 'cafe':
        type = 'Cafe';
        icon = cafeIcon;
        break;
      case 'bar':
        type = 'Bar';
        icon = barIcon;
        break;
      case 'store':
        type = 'Shop';
        icon = shopIcon;
        break;
      case 'lodging':
        type = 'Hotel';
        icon = hotelIcon;
        break;
      default:
        type = placeInfo.types[0];
        icon = searchMarker;
    }

    map.panTo(placeInfo.geometry.location);
    infoWindow.setContent(`
      <div style='width: 300px'>
        <div style='width: 100%; display: flex'>
          <div style='width: 60%'>
            <h2>${placeName}</h2>
            <div style='display: flex; align-items: center'>
              <img src=${icon} style='width: 20px'>
              <div style='font-size: 16px; margin: 0 3px'>${type}</div>
            </div>
            <h3>${address}</h3>
          </div>
          <div style='width: 40%; margin: 10px; background: #ffffff url("${photo}") no-repeat center center; background-size: cover'></div>
        </div>
        <div style='width: 100%; display: flex; align-items: end'>
          <div>
            <h4 style='margin: 5px 0'>${rating} ${voteNumber}</h4>
            <a style='color: #313131' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${place_id}' target='_blank'>Find on google map</a>
          </div>
          <img id='addBtn' src=${addPinIcon} style='width: 28px; height: 28px; margin: 0 10px 0 auto; cursor: pointer;'/>
        </div>
      </div>
    `);
    infoWindow.open({
      anchor: focusedDrawingAreaMarker ? focusedDrawingAreaMarker : marker,
      map: map,
      shouldFocus: true,
      maxWidth: 350
    });
  };

  const searchPlace = () => {
    setInputTarget(current => current.value = '');
    setInputValue('');
    infoWindow.close();
    const service = new google.maps.places.PlacesService(map);
    let request = {
      query: inputTarget.value,
      fields: placeReturnField,
    };
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaceInfo(results[0]);
        showMarker(results[0].geometry.location);
      }
    });
  };

  const enableDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    map.addListener('mousedown', () => drawFreeRegion());
  }

  const drawFreeRegion = () => {
    const poly = new google.maps.Polyline({
      clickable: false,
      map: map,
      strokeColor: '#848484',
      strokeWeight: 3,
    });
    map.addListener('mousemove', (e) => {
      // document.body.style.cursor = "url('../../img/icons_drawing.png'), crosshair";
      poly.getPath().push(e.latLng);
    });
    map.addListener('mouseup', () => {
      const path = poly.getPath();
      poly.setMap(null);
      const region = new google.maps.Polygon({
        clickable: false,
        fillColor: '#848484',
        fillOpacity: 0.3,
        geodesic: true,
        map: map,
        path: path.getArray(),
        strokeColor: '#848484',
        strokeWeight: 3
      });
      setArea(region);
    });
  }

  useEffect(() => {
    if (area) {
      map.setOptions({ draggable: true });
      google.maps.event.clearListeners(map, 'mousedown');
      google.maps.event.clearListeners(map, 'mousemove');
      google.maps.event.clearListeners(map, 'mouseup');
      
      const service = new google.maps.places.PlacesService(map);
      const paths = area.getPaths();
      let pathLatLng = [];
      paths.forEach(path => {
        const latLngArr = path.getArray();
        latLngArr.forEach(latLng => {
          const lat = latLng.lat();
          const lng = latLng.lng();
          pathLatLng.push({
            lat: lat,
            lng: lng
          });
        });
      });
      const maxLat = Math.max(...pathLatLng.map(latLng => latLng.lat));
      const minLat = Math.min(...pathLatLng.map(latLng => latLng.lat));
      const maxLng = Math.max(...pathLatLng.map(latLng => latLng.lng));
      const minLng = Math.min(...pathLatLng.map(latLng => latLng.lng));
      const southWest = new google.maps.LatLng({ lat: minLat, lng: minLng});
      const northEast = new google.maps.LatLng({ lat: maxLat, lng: maxLng});
      const areaCenter = new google.maps.LatLng({
        lat: (maxLat+minLat)/2,
        lng: (maxLng+minLng)/2
      })
      const bounds = new google.maps.LatLngBounds(southWest, northEast);
      let request = {
        bounds: bounds,
        type: [drawingOption],
        fields: placeReturnField,
      };
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let markers = [];
          results.forEach((result) => {
            const markerOptions = {
              map: map,
              position: result.geometry.location,
              icon: searchMarker,
            }
            let marker = new google.maps.Marker(markerOptions);
            marker.addListener('click', () => {
              setFocusedDrawingAreaMarker(marker);
              setPlaceInfo(result);
            });
            markers.push(marker);
          });
          map.panTo(areaCenter);
          setDrawingAreaMarkers(markers);
        }
      });
    }
  }, [area]);

  const stopDrawing = (e) => {
    e.preventDefault();
    checkedOption.current.checked = false;
    setIsDrawing(false);
    setIsDrawBtnDisabled(true);
    setDrawingOption(null);
    map.setOptions({ draggable: true });
    if (area) {
      area.setMap(null);
      setArea(null);
      drawingAreaMarkers.forEach(marker => marker.setMap(null));
      setDrawingAreaMarkers([]);
    }
  }

  const handelSearchOptionInput = (e) => {
    map.setOptions({ draggable: false });
    checkedOption.current = e.target;
    setIsDrawBtnDisabled(false);
    setDrawingOption(e.target.value);
    setFocusedDrawingAreaMarker(null);
  };

  return(
    <div>
      <div className='search-input-block'>
        <input type='text' className='search-input' onChange={(e) => setInputValue(e.target.value)} onClick={(e) => setInputTarget(e.target)}/>
        <input type='button' className='search-button' onClick={() => searchPlace()}/>
      </div>
      <form className='drawing-search-option' onChange={handelSearchOptionInput}>
        <div title='Attraction'>
          <input type='radio' id='tourist_attraction' value='tourist_attraction' name='search-option'/>
          <label htmlFor='tourist_attraction'>
            <img src={attractionIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <div title='Restaurant'>
          <input type='radio' value='restaurant' id='restaurant' name='search-option'/>
          <label htmlFor='restaurant'>
            <img src={restaurantIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <div title='Cafe'>
          <input type='radio' value='cafe' id='cafe' name='search-option'/>
          <label htmlFor='cafe'>
            <img src={cafeIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <div title='Bar'>
          <input type='radio' value='bar' id='bar' name='search-option'/>
          <label htmlFor='bar'>
            <img src={barIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <div title='Shop'>
          <input type='radio' value='store' id='store' name='search-option'/>
          <label htmlFor='store'>
            <img src={shopIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <div title='Hotel'>
          <input type='radio' value='lodging' id='lodging' name='search-option'/>
          <label htmlFor='lodging'>
            <img src={hotelIcon} className='drawing-search-option-icon'/>
          </label>
        </div>
        <button className={drawingClassName} onClick={enableDrawing} title='Choose a type, draw an area to search places!' disabled={isDrawBtnDisabled}>
          <img src={drawingIcon} className='draw-btn-icon'/>
        </button>
        <button className={stopDrawingClassName} onClick={stopDrawing} title='Remove area/Stop drawing'>
          <img src={eraserIcon} className='draw-btn-icon'/>
        </button>
      </form>
    </div>
    )
}

export default SearchBar;
