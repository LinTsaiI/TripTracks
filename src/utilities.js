import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

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

