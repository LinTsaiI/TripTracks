import React, { useState, useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Loader } from '@googlemaps/js-api-loader';
import { resetNewTrip } from '../../store/slice/dashboardSlice';
import { fetchDayTrack, initTrackData, clearPinList, deletePin } from '../../store/slice/tripSlice';
import { getTrackData } from '../../utilities';
import Tracks from './Tracks';
import Search from './Search';
import Notes from './Notes';
import Footer from '../Footer/Footer';
import './Trip.css';
import pinMarker from '../../img/icons_marker.png';
import trashCanIcon from '../../img/icons_trashcan.png';
import attractionIcon from '../../img/icons_attractions.png';
import restaurantIcon from '../../img/icons_restaurant.png';
import cafeIcon from '../../img/icons_cafe.png';
import barIcon from '../../img/icons_bar.png';
import shopIcon from '../../img/icons_shop.png';
import hotelIcon from '../../img/icons_hotel.png';
import defaultMarker from '../../img/icons_hotelMarker.png';
import star from '../../img/icons_star.png';
import imgPlaceholder from '../../img/img_placeholder.png';

export const TripContext = createContext();
export const MapContext = createContext();

export const getTripData = async (tripId) => {
  try {
    const tripSnap = await getDoc(doc(db, 'trips', tripId));
    if (tripSnap.exists()) {
      return tripSnap.data();
    }
  } catch (err) {
    console.log('Error getting document: ', err);
  }
};

export const saveMap = async (mapInfo) => {
  const { tripId, trackId, lat, lng, zoom } = mapInfo;
  console.log('save map, target: ', trackId);
  try {
    await updateDoc(doc(db, 'trips', tripId, 'tracks', trackId), {
      mapCenter: { lat: lat, lng: lng },
      zoom: zoom
    });
  } catch (err) {
    console.log('Error saving mapCenter', err);
  }
};

const Trip = () => {
  const params = useParams();
  const tripId = params.tripId;
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const dispatch = useDispatch();
  const isNewTrip = useSelector(state => state.dashboard.isNewTrip);
  const dayTrack = useSelector(state => state.trip);
  const mapRegin = useRef();
  const [tripInfo, setTripInfo] = useState(null);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [pinMarkerList, setPinMarkerList] = useState([]);
  const [pinLatLng, setPinLatLng] = useState([]);
  const [path, setPath] = useState(null);
  const [focusInfoWindow, setFocusInfoWindow] = useState(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [currentFocusNote, setCurrentFocusNote] = useState(null);
  const dataFetching = dayTrack.isFetching ? 'fetching-data' : 'display-none';
  const pathUpdating = dayTrack.isPathUpdating ? 'path-updating' : 'display-none';

  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    if (isNewTrip) {
      dispatch(resetNewTrip());
    }
  }, []);

  useEffect(() => {
    getTripData(tripId)
      .then(tripData => {
        setTripInfo(tripData);
        return getTrackData(tripId, trackIndex);
      })
      .then(trackData => {
        dispatch(initTrackData(trackData));
        mapLoader.load().then(() => {
          const center = trackData.mapCenter;
          const zoom = trackData.zoom
          const map = new google.maps.Map(mapRegin.current, {
            mapId: '6fe2140f54e6c7b3',
            mapTypeControl: false,
            keyboardShortcuts: false,
            center: center,
            zoom: zoom
          });
          const infoWindow = new google.maps.InfoWindow();
          setMap(map);
          setInfoWindow(infoWindow);
          let markerList = [];
          let latLngList = [];
          trackData.pinList.forEach((pin, index) => {
            const markerOptions = {
              map: map,
              position: pin.position,
              icon: pinMarker,
              label: {
                text: (index+1).toString(),
                className: 'marker-label',
                color: 'grey',
                fontWeight: 'bold'
              }
            }
            let marker = new google.maps.Marker(markerOptions);
            markerList.push(marker);
            latLngList.push(pin.position)
          });
          setPinMarkerList(markerList);
          setPinLatLng(latLngList);
        });
      });
  }, []);

  useEffect(() => {
    if (map) {
      return () => {
        dispatch(clearPinList());
      }
    }
  }, [map]);

  useEffect(() => {
    if (pinLatLng && map) {
      const pinPath = new google.maps.Polyline({
        path: pinLatLng,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 3,
      });
      setPath(pinPath);
      pinPath.setMap(map);
    }
  }, [pinLatLng]);

  useEffect(() => {
    if (tripInfo) {
      const mapCenter = map.getCenter();
      const zoom = map.getZoom();
      path.setMap(null);
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
        setPinMarkerList(currentMarkerList);
      }
      dispatch(fetchDayTrack({
        tripId: tripId,
        trackIndex: trackIndex,
      }));
      return () => {
        saveMap({
          tripId: tripId,
          trackId: dayTrack.trackId,
          lat: mapCenter.lat(),
          lng: mapCenter.lng(),
          zoom: zoom
        });
      }
    }
  }, [trackIndex]);

  useEffect(() => {
    if (map) {
      map.setCenter(dayTrack.mapCenter);
      map.setZoom(dayTrack.zoom);
    }
  }, [dayTrack.mapCenter, dayTrack.zoom]);

  useEffect(() => {
    if (map && dayTrack.pinList) {
      path.setMap(null);
      if (pinMarkerList) {
        let currentMarkerList = [...pinMarkerList];
        currentMarkerList.forEach(marker => {
          marker.setMap(null);
        });
      }
      let markerList = [];
      let latLngList = [];
      dayTrack.pinList.forEach((pin, index) => {
        const markerOptions = {
          map: map,
          position: pin.position,
          icon: pinMarker,
          label: {
            text: (index+1).toString(),
            className: 'marker-label',
            color: 'grey',
            fontWeight: 'bold'
          }
        }
        let marker = new google.maps.Marker(markerOptions);
        markerList.push(marker);
        latLngList.push(pin.position);
      });
      setPinMarkerList(markerList);
      setPinLatLng(latLngList);
    }
  }, [dayTrack.pinList]);

  useEffect(() => {
    if (pinMarkerList) {
      pinMarkerList.forEach((pinMarker, index) => {
        pinMarker.addListener('click', () => {
          showPinInfoWindow(pinMarker, index);
        });
      });
    }
  }, [pinMarkerList]);

  useEffect(() => {
    if (focusInfoWindow) {
      return () => {
        google.maps.event.removeListener(focusInfoWindow);
      }
    }
  }, [focusInfoWindow]);

  const showPinInfoWindow = (pinMarker, index) => {
    map.panTo(dayTrack.pinList[index].position);
    let infoWindowListener = infoWindow.addListener('domready', () => {
      const deleteBtn = document.getElementById('deleteBtn');
      deleteBtn.addEventListener('click', () => {
        const restPinIds = [...dayTrack.pinIds];
        restPinIds.splice(index, 1);
        const newDirectionOptions = [...dayTrack.directions];
        const directionOptionRemoveTarget = (index == dayTrack.pinList.length) ? index - 1 : index;
        newDirectionOptions.splice(directionOptionRemoveTarget, 1);
        dispatch(deletePin({
          tripId: tripId,
          trackId: dayTrack.trackId,
          pinId: dayTrack.pinIds[index],
          restPinIds: restPinIds,
          newDirections: newDirectionOptions
        }));
        infoWindow.close();
      });
    });
    setFocusInfoWindow(infoWindowListener);

    const service = new google.maps.places.PlacesService(map);
    let request = {
      placeId: dayTrack.pinList[index].id,
      fields: ['photos']
    };
    service.getDetails(request, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const photo = result.photos ? result.photos[0].getUrl() : imgPlaceholder;
        const placeName = dayTrack.pinList[index].name;
        const address = dayTrack.pinList[index].address;
        const placeId = dayTrack.pinList[index].id;
        const type = dayTrack.pinList[index].type;
        const rating = dayTrack.pinList[index].rating ? dayTrack.pinList[index].rating : '';
        const voteNumber = dayTrack.pinList[index].voteNumber ? `(${dayTrack.pinList[index].voteNumber} Reviews)` : '';
        let displayType;
        let icon;
        switch (type) {
          case 'tourist_attraction':
            displayType = 'Attraction';
            icon = attractionIcon;
            break;
          case 'restaurant':
            displayType = 'Restaurant';
            icon = restaurantIcon;
            break;
          case 'cafe':
            displayType = 'Cafe';
            icon = cafeIcon;
            break;
          case 'bar':
            displayType = 'Bar';
            icon = barIcon;
            break;
          case 'store':
            displayType = 'Shop';
            icon = shopIcon;
            break;
          case 'lodging':
            displayType = 'Hotel';
            icon = hotelIcon;
            break;
          default:
            displayType = 'Others';
            icon = defaultMarker;
        }
        infoWindow.setContent(`
          <div class='infoWindow-container'>
            <div class='infoWindow-upper'>
              <div class='infoWindow-upper-left'>
                <h2>${placeName}</h2>
                <div class='infoWindow-upper-left-type'>
                  <img src=${icon}>
                  <div class='infoWindow-upper-left-type'>${displayType}</div>
                </div>
                <h4>${address}</h4>
              </div>
              <img src=${photo} class='infoWindow-upper-right'/>
            </div>
            <div class='infoWindow-bottom'>
              <div>
                <div class='infoWindow-bottom-rating'>
                  <div></div>
                  <p>${rating} ${voteNumber}</p>
                </div>
                <a style='color: #313131' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}' target='_blank'>Find on google map</a>
              </div>
              <div id='deleteBtn' class='infoWindow-bottom-trashcan'></div>
            </div>
          </div>
        `);
        infoWindow.open({
          anchor: pinMarker,
          map: map,
          shouldFocus: true,
          maxWidth: 300,
          minWidth: 250
        });
      } else {
        console.log('can not get place info');
      }
    });    
  };

  if (tripInfo) {
    return (
      <div className='trip-container'>
        <div className={dataFetching}></div>
        <MapContext.Provider value={{
          map: map,
          infoWindow: infoWindow
        }}>
          <TripContext.Provider value={{
            pinLatLng: pinLatLng,
            pinMarkerList: pinMarkerList,
          }}>
            <Tracks
              tripInfo={tripInfo}
              setIsNoteOpen={setIsNoteOpen}
              currentFocusNote={currentFocusNote}
              setCurrentFocusNote={setCurrentFocusNote}
              setFocusInfoWindow={setFocusInfoWindow}
            />
            <Search
              setFocusInfoWindow={setFocusInfoWindow}
              setIsNoteOpen={setIsNoteOpen}
            />
            <Notes
              isNoteOpen={isNoteOpen}
              setIsNoteOpen={setIsNoteOpen}
              currentFocusNote={currentFocusNote}
              setCurrentFocusNote={setCurrentFocusNote}
            />
          </TripContext.Provider>
          <div className='map-region'>
            <div className={pathUpdating}/>
            <div className='map' ref={mapRegin}/>
          </div>          
        </MapContext.Provider>
        <Footer />
      </div>
    );
  }
}

export default Trip;