import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import star from './img/icons_star.png';

export const getTrackData = async (tripId, trackIndex) => {
  try {
    const trackSnap = await getDocs(collection(db, 'trips', tripId, 'tracks'));
    const trackIds = [];
    const trackInfos = [];
    trackSnap.forEach(track => {
      trackIds.push(track.id);
      trackInfos.push(track.data());
    });
    const targetTrackId = trackIds[trackIndex];
    const { mapCenter, zoom, directions } = trackInfos[trackIndex];
    const condition = query(collection(db, 'trips', tripId, 'tracks', targetTrackId, 'pins'), orderBy('index'));
    const pinSnap = await getDocs(condition);
    let pinIds = [];
    let pinList = [];
    pinSnap.forEach(pin => {
      pinIds.push(pin.id);
      pinList.push(pin.data());
    });
    return {
      tripId: tripId,
      trackId: targetTrackId,
      mapCenter: mapCenter,
      zoom: zoom,
      pinIds: pinIds,
      pinList: pinList,
      directions: directions
    }
  } catch (err) {
    console.log('Error getting document: ', err);
  }
};

export const setInfoWindowContent = (placeName, icon, type, address, photo, rating, voteNumber, placeId, btnType, btnIcon) => {
  return (
    `<div style='width: 300px'>
      <div style='width: 100%; display: flex'>
        <div style='width: 60%'>
          <h2>${placeName}</h2>
          <div style='display: flex; align-items: center'>
            <img src=${icon} style='width: 20px'>
            <div style='font-size: 16px; margin: 0 3px'>${type}</div>
          </div>
          <h4>${address}</h4>
        </div>
        <div style='width: 40%; margin: 10px; background: #ffffff url("${photo}") no-repeat center center; background-size: cover'></div>
      </div>
      <div style='width: 100%; display: flex; align-items: end'>
        <div>
          <div style='display: flex; align-items: center; margin: 5px 0'>
            <img src=${star} style='width: 15px; height: 15px'/>
            <p style='margin: 0 3px'>${rating} ${voteNumber}</p>
          </div>
          <a style='color: #313131' href='https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}' target='_blank'>Find on google map</a>
        </div>
        <img id=${btnType} src=${btnIcon} style='width: 28px; height: 28px; margin: 0 10px 0 auto; cursor: pointer;'/>
      </div>
    </div>`
  );
}