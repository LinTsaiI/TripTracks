import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContext, TripContext } from '../Trip/Trip';
import { addNewPin } from '../../store/slice/tripSlice';
import './SearchBar.css';
import addPinIcon from '../../img/icons_pin2.png';
import drawingIcon from '../../img/icons_drawing.png';
import eraserIcon from '../../img/icons_eraser.png';
import searchMarker from '../../img/icons_searchMarker.png';

const SearchBar = ({ setFocusInfoWindow }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputTarget, setInputTarget] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [area, setArea] = useState(null);
  const [drawingAreaMarkers, setDrawingAreaMarkers] = useState([]);
  const drawingClassName = isDrawing ? 'display-none' : 'draw-btn';
  const stopDrawingClassName = isDrawing ? 'draw-btn' : 'display-none';
  const dayTrack = useSelector(state => state.trip);
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
    console.log(inputValue)
  }, [inputValue]);

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
    if (marker) {
      infoWindow.close();
      marker.addListener('click', () => {
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
          marker.setVisible(false);
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
        <img id='addBtn' src=${addPinIcon} style='float: right; width: 28px; height: 28px; margin: 0 10px; cursor: pointer;'/>
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

  const enableDrawing = () => {
    setIsDrawing(true);
    document.body.style.cursor = "url('../../img/icons_drawing.png'), crosshair";
    map.setOptions({ draggable: false });
    map.addListener('mousedown', () => drawFreeRegion());
  }

  const drawFreeRegion = () => {
    const poly = new google.maps.Polyline({
      clickable: false,
      map: map,
      strokeColor: '#2D658C',
      strokeWeight: 3,
    });
    map.addListener('mousemove', (e) => {
      poly.getPath().push(e.latLng);
    });
    map.addListener('mouseup', () => {
      const path = poly.getPath();
      poly.setMap(null);
      const region = new google.maps.Polygon({
        clickable: false,
        fillColor: '#2D658C',
        fillOpacity: 0.25,
        geodesic: true,
        map: map,
        path: path.getArray(),
        strokeColor: '#2D658C',
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
        type: ['restaurant'],
        fields: placeReturnField,
      };
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let markers = [];
          results.forEach(result => {
            const markerOptions = {
              map: map,
              position: result.geometry.location,
              icon: searchMarker
            }
            let marker = new google.maps.Marker(markerOptions);
            markers.push(marker);
          });
          map.panTo(areaCenter);
          setDrawingAreaMarkers(markers);
        }
      });
    }
  }, [area]);

  const stopDrawing = () => {
    console.log('stop drawing');
    setIsDrawing(false);
    map.setOptions({ draggable: true });
    if (area) {
      area.setMap(null);
      setArea(null);
      drawingAreaMarkers.forEach(marker => marker.setMap(null));
      setDrawingAreaMarkers([]);
    }
  }

  return(
    <div className='search-bar'>
      <div className='search-input-block'>
        <input type='text' className='search-input' onChange={(e) => setInputValue(e.target.value)} onClick={(e) => setInputTarget(e.target)}/>
        <input type='button' className='search-button' onClick={() => searchPlace()}/>
      </div>
      <button className={drawingClassName} onClick={enableDrawing}>
        <img src={drawingIcon} className='draw-btn-icon'/>
        Draw an area
      </button>
      <button className={stopDrawingClassName} onClick={stopDrawing}>
        <img src={eraserIcon} className='draw-btn-icon'/>
        Remove area
      </button>
    </div>
    )
}

export default SearchBar;

/*
tourist_attraction
restaurant
bar
cafe
lodging
store
*/