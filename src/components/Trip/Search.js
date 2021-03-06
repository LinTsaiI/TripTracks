import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { MapContext } from './Trip';
import { addNewPin } from '../../store/slice/tripSlice';
import { setInfoWindowContent } from '../../utilities';
import './Search.css';
import singleSearchMarker from '../../img/icons_searchMarker.png';
import addPinIcon from '../../img/icons_pin.png';
import drawingIcon from '../../img/icons_drawing.png';
import eraserIcon from '../../img/icons_eraser.png';
import attractionMarker from '../../img/icons_attractionMarker.png';
import restaurantMarker from '../../img/icons_restaurantMarker.png';
import cafeMarker from '../../img/icons_cafeMarker.png';
import barMarker from '../../img/icons_barMarker.png';
import shopMarker from '../../img/icons_shopMarker.png';
import hotelMarker from '../../img/icons_hotelMarker.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';
import imgPlaceholder from '../../img/img_placeholder.png';

const Search = ({ setFocusInfoWindow, setIsNoteOpen }) => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const [inputQuery, setInputQuery] = useState('');
  const [inputTarget, setInputTarget] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [area, setArea] = useState(null);
  const [drawingAreaMarkers, setDrawingAreaMarkers] = useState([]);
  const [isDrawBtnDisabled, setIsDrawBtnDisabled] = useState(true);
  const [drawingOption, setDrawingOption] = useState(null);
  const [drawingCover, setDrawingCover] = useState('display-none');
  const checkedOption = useRef();
  const drawingClassName = isDrawing ? 'display-none' : 'draw-btn';
  const stopDrawingClassName = isDrawing ? 'draw-btn' : 'display-none';
  const dayTrack = useSelector(state => state.trip);
  const dispatch = useDispatch();
  const mapValue = useContext(MapContext);
  const { map, infoWindow } = mapValue;
  const placeReturnField = ['name', 'types', 'geometry', 'formatted_address', 'photos', 'place_id', 'rating', 'user_ratings_total'];
  const autocompleteOptions = {
    fields: placeReturnField,
    strictBounds: false,
    types: ['establishment'],
  };

  useEffect(() => {
    if (map) {
      map.addListener('click', (event) => {
        if (event.placeId) {
          event.stop();
          const service = new google.maps.places.PlacesService(map);
          const marker = new google.maps.Marker({
            map: map,
            icon: singleSearchMarker,
            zIndex: 99
          });
          const request = {
            placeId: event.placeId,
            fields: placeReturnField
          };
          service.getDetails(request, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              setPlaceInfo(result);
              setMarker(marker);
              showInfoWindow(result, marker);
              marker.addListener('click', () => {
                showInfoWindow(result, marker);
              });
            }
          });
        }
      });
    }
  }, [map]);

  useEffect(() => {
    setTimeout(() => {
      if (map && inputTarget) {
        let autocomplete = new window.google.maps.places.Autocomplete(inputTarget, autocompleteOptions);
        autocomplete.bindTo('bounds', map);
        autocomplete.addListener('place_changed', () => {
          console.log('autocomplete')
          setInputQuery('');
          const place = autocomplete.getPlace();
          const marker = new google.maps.Marker({
            map: map,
            icon: singleSearchMarker,
            zIndex: 99
          });
          showInfoWindow(place, marker);
          setMarker(marker);
          setPlaceInfo(place);
          marker.addListener('click', () => {
            showInfoWindow(place, marker);
          });
        });
      }
    }, 1500);
  }, [inputTarget]);

  useEffect(() => {
    if (marker && placeInfo) {
      const position = placeInfo.geometry.location;
      if (map.getBounds().contains(position)) {
        map.panTo(position);
        marker.setPosition(position);
      } else {
        map.setZoom(13);
        setTimeout(() => {
          map.setCenter(position);
          map.setZoom(14);
          marker.setPosition(position);
        }, 500)
      }
    }
  }, [marker]);

  useEffect(() => {
    if (placeInfo) {
      let infoWindowListener = infoWindow.addListener('domready', () => {
        const addBtn = document.getElementById('addBtn');
        addBtn.addEventListener('click', () => {
          const newDirectionOptions = [...dayTrack.directions, 'DRIVING'];
          const placeName = placeInfo.name;
          const address = placeInfo.formatted_address ? placeInfo.formatted_address : placeInfo.vicinity;
          const lat = placeInfo.geometry.location.lat();
          const lng = placeInfo.geometry.location.lng();
          const photo = placeInfo.photos ? placeInfo.photos[0].getUrl() : '';
          const place_id = placeInfo.place_id;
          const placeType = drawingOption ? drawingOption : placeInfo.types[0];
          const rating = placeInfo.rating;
          const voteNumber = placeInfo.user_ratings_total ? placeInfo.user_ratings_total : '';
          dispatch(addNewPin({
            tripId: dayTrack.tripId,
            trackId: dayTrack.trackId,
            currentPinListLength: dayTrack.pinList.length,
            placeName: placeName,
            address: address,
            lat: lat,
            lng: lng,
            photo: photo,
            placeId: place_id,
            placeType: placeType,
            rating: rating,
            voteNumber: voteNumber,
            newDirections: newDirectionOptions
          }));
          setIsNoteOpen(false);
          marker.setMap(null);
          setMarker(null);
          infoWindow.close();
        });
      });
      setFocusInfoWindow(infoWindowListener);
      return () => {
        google.maps.event.removeListener(infoWindowListener);
        if (marker) {
          marker.setMap(null);
        }
      }
    }
  }, [placeInfo]);

  const showInfoWindow = (place = placeInfo, focusedMarker = marker) => {
    console.log(place)
    const placeName = place.name;
    const address = place.formatted_address ? place.formatted_address : place.vicinity;
    const photo = place.photos ? place.photos[0].getUrl() : imgPlaceholder;
    const placeId = place.place_id;
    const rating = place.rating ? place.rating : '';
    const voteNumber = place.user_ratings_total ? `(${place.user_ratings_total} Reviews)` : '';
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
        type = place.types[0];
        icon = hotelMarker;
    }

    const infoWindowContent = setInfoWindowContent(placeName, icon, type, address, photo, rating, voteNumber, placeId, 'addBtn', addPinIcon);
    infoWindow.setContent(infoWindowContent);
    map.panTo(place.geometry.location);
    infoWindow.open({
      anchor: focusedMarker,
      map: map,
      shouldFocus: true,
      maxWidth: 300,
    });
  };

  const searchPlace = () => {
    if (inputQuery) {
      console.log('find place')
      setInputQuery('');
      infoWindow.close();
      const service = new google.maps.places.PlacesService(map);
      let request = {
        query: inputQuery,
        fields: placeReturnField,
      };
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaceInfo(results[0]);
          const marker = new google.maps.Marker({
            map: map,
            icon: singleSearchMarker,
            zIndex: 99
          });
          showInfoWindow(results[0], marker);
          marker.addListener('click', () => {
            showInfoWindow(results[0], marker);
          })
          setMarker(marker);
        } else {
          console.log('no such place');
        }
      });
    }
  };

  const handelSearchOptionInput = (e) => {
    google.maps.event.clearListeners(map, 'mousedown');
    map.setOptions({ draggable: false, clickableIcons: false });
    checkedOption.current = e.target;
    setIsDrawBtnDisabled(false);
    setDrawingOption(e.target.value);
    if (marker) {
      marker.setMap(null);
    }
    setIsDrawing(true);
    setDrawingCover('drawing-cover');
    infoWindow.close();
    map.addListener('mousedown', () => drawFreeRegion());
    map.addListener('touchstart', () => drawFreeRegion());
  };

  const drawFreeRegion = () => {
    const poly = new google.maps.Polyline({
      clickable: false,
      map: map,
      strokeColor: '#848484',
      strokeWeight: 3,
    });
    map.addListener('mousemove', (e) => poly.getPath().push(e.latLng));
    map.addListener('touchmove', (e) => poly.getPath().push(e.latLng));
    const finishDrawing = () => {
      setDrawingCover('display-none');
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
    }
    map.addListener('mouseup', () => finishDrawing());
    map.addListener('touchend', () => finishDrawing());
  }

  useEffect(() => {
    if (area) {
      map.setOptions({ draggable: true });
      google.maps.event.clearListeners(map, 'mousedown');
      google.maps.event.clearListeners(map, 'mousemove');
      google.maps.event.clearListeners(map, 'mouseup');
      google.maps.event.clearListeners(map, 'touchstart');
      google.maps.event.clearListeners(map, 'touchmove');
      google.maps.event.clearListeners(map, 'touchend');

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
      };
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          map.fitBounds(bounds, 20);
          let markers = [];
          let drawingSearchMarker;
          switch (drawingOption) {
            case 'tourist_attraction':
              drawingSearchMarker = attractionMarker;
              break;
            case 'restaurant':
              drawingSearchMarker = restaurantMarker;
              break;
            case 'cafe':
              drawingSearchMarker = cafeMarker;
              break;
            case 'bar':
              drawingSearchMarker = barMarker;
              break;
            case 'store':
              drawingSearchMarker = shopMarker;
              break;
            case 'lodging':
              drawingSearchMarker = hotelMarker;
              break;
            default:
              drawingSearchMarker = hotelMarker;
          }

          results.forEach(result => {
            const markerOptions = {
              map: map,
              position: result.geometry.location,
              icon: drawingSearchMarker,
              optimized: true,
              zIndex: 99
            }
            const isInRegion = google.maps.geometry.poly.containsLocation(result.geometry.location, area)
            if (isInRegion) {
              let marker = new google.maps.Marker(markerOptions);
              marker.addListener('click', () => {
                showInfoWindow(result, marker);
                setPlaceInfo(result);
              });
              markers.push(marker);
            }
          });
          map.panTo(areaCenter);
          setDrawingAreaMarkers(markers);
        }
      });
    }
  }, [area]);

  const resetDrawingArea = () => {
    checkedOption.current.checked = false;
    setIsDrawing(false);
    setIsDrawBtnDisabled(true);
    setDrawingOption(null);
    setDrawingCover('display-none');
    infoWindow.close();
    map.setOptions({ draggable: true, clickableIcons: true });
    if (area) {
      area.setMap(null);
      setArea(null);
      drawingAreaMarkers.forEach(marker => marker.setMap(null));
      setDrawingAreaMarkers([]);
    }
  }

  const stopDrawing = (e) => {
    e.preventDefault();
    resetDrawingArea();
  }

  useEffect(() => {
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
    if (infoWindow) {
      infoWindow.close();
    }
    if (checkedOption.current) {
      resetDrawingArea();
    }
  }, [trackIndex]);

  return(
    <div>
      <div className={drawingCover}></div>
      <div className='search-input-block'>
        <input type='text' className='search-input' value={inputQuery}
          onClick={(e) => setInputTarget(e.target)}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key == 'Enter') {
              searchPlace();
            }
          }}
        />
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
        <button className={drawingClassName} title='Choose a type, draw an area to search places!' disabled={isDrawBtnDisabled}>
          <img src={drawingIcon} className='draw-btn-icon'/>
        </button>
        <button className={stopDrawingClassName} onClick={stopDrawing} title='Remove area/Stop drawing'>
          <img src={eraserIcon} className='draw-btn-icon'/>
        </button>
      </form>
    </div>
    )
}

export default Search;
