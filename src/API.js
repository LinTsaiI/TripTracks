import { auth, db, provider } from './firebase';
import { sendSignInLinkToEmail, signInWithPopup  } from 'firebase/auth';
import { runTransaction, setDoc, addDoc, serverTimestamp, collection, doc, updateDoc, getDoc, arrayUnion, getDocs, query, where, deleteDoc } from 'firebase/firestore';


// 使用者身份相關（進入每個頁面都要驗證身份）
// 登入
// Sign in with Email
const actionCodeSettings = {
  url: 'http://localhost:3000/dashboard',
  // This must be true.
  handleCodeInApp: true,
};
export const emailSignIn = (email) => {
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then((result) => {
    console.log(result);
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch((error) => {
    console.log(error);
  });
};

// Sign in with Google
export const googleSignIn = () => {
  signInWithPopup(auth, provider)
  .then(result => {
    let userId = result.user.uid;
    console.log(userId);
  }).catch((error) => {
    console.log(error);
  });
};

// Add user to user collection database
export const creatUserIfNew = async (userId, username, email) => {
  try {
    const userSnap = await getDoc(doc(db, 'user', userId));
    if (userSnap.exists()) {
      console.log(userSnap.data());
    } else {
      try {
        await setDoc(doc(db, 'user', userId), {
          name: username,
          email: email,
          tripId: [],
          FirstEntryTime: serverTimestamp()
        });
        console.log('create user successfully');
      } catch (err) {
        console.error('Error adding document: ', err);
      }
    }
  } catch (err) {
    console.error('Error adding document: ', err);
  }
};


// 行程資訊相關
// 點擊 start to plan 新增空白行程
export const createNewTrip = async (newTrip) => {
  const { userId, tripName, startDate, endDate } = newTrip;
  try {
    const docRef = await addDoc(collection(db, 'trips'), {
      userId: userId,
      tripName: tripName,
      startDate: startDate,
      endDate: endDate,
    });
    if (docRef.id) {
      updateDoc(doc(db, 'user', userId), {
        tripId: arrayUnion(docRef.id)
      });
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = (end - start)/(1000 * 3600 * 24) + 1;
      for (let i = 0; i < duration; i++) {
        await addDoc(collection(db, 'trips', docRef.id, 'tracks'), {
          mapCenter: {lat: 0, lng: 0},
          zoom: 0,
        });
      }
      return docRef.id;
    }
  } catch (err) {
    console.log('Error creating new trip: ', err);
  }
};

// 建立新 trip，同時依天數建立空的 track 文件
// export const createNewTrack = async (userId, tripId, duration) => {
//   try {
//     const docContent = {
//       userId: userId,
//       tripId: tripId,
//       mapCenter: {lat: 0, lng: 0},
//       zoom: 0,
//       pins: [],
//       directions: []
//     };
//     for (let i = 0; i < duration; i++) {
//       const docRef = await addDoc(collection(db, 'tracks'), docContent);
//       if (docRef.id) {
//         updateDoc(doc(db, 'trips', tripId), {
//           trackId: arrayUnion(docRef.id)
//         });
//       }
//     }
//   } catch (err) {
//     console.log('Error adding document: ', err);
//   }
// };

// 取得使用者已建立的所有行程，用以在 Dashboard 顯示行程名稱/日期區間
export const getTripList = async (userId) => {
  const condition = query(collection(db, 'trips'), where('userId', '==', userId));
  const querySnapshot = await getDocs(condition);
  let tripList = [];
  querySnapshot.forEach(doc => {
    let trip = {
      tripId: doc.id,
      tripName: doc.data().tripName,
      startDate: doc.data().startDate,
      endDate: doc.data().endDate
    };
    tripList.push(trip);
  });
  return tripList;
};

// 取得特定 tripId 的所有資訊，進入 /trip/tripId 時用以顯示行程名稱/天數/日期區間
export const getTripData = async (tripId) => {
  try {
    const tripSnap = await getDoc(doc(db, 'trips', tripId));
    if (tripSnap.exists()) {
      console.log(tripSnap.data());
      return tripSnap.data();
    }
  } catch (err) {
    console.log('Error getting document: ', err);
  }
};

// 進入 /trip/tripId?day= 頁面，載入該天的景點list/地圖上的marker位置
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
    const { mapCenter, zoom } = trackInfos[trackIndex];
    const pinSnap = await getDocs(collection(db, 'trips', tripId, 'tracks', targetTrackId, 'pins'));
    let pinIds = [];
    let pinList = [];
    pinSnap.forEach(pin => {
      pinIds.push(pin.id);
      pinList.push(pin.data());
    });
    const directionSnap = await getDocs(collection(db, 'trips', tripId, 'tracks', targetTrackId, 'directions'));
    let directions = [];
    directionSnap.forEach(direction => directions.push(direction.data()));
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

// 將景點加入 pinList
export const addToPinList = async (pinInfo) => {
  const { tripId, trackId, placeName, lat, lng, address, photo } = pinInfo;
  try {
    const pinContent = {
      name: placeName,
      position: { lat: lat, lng: lng },
      address: address,
      photo: photo,
      notes: ''
    }
    const pinDocRef = await addDoc(collection(db, 'trips', tripId, 'tracks', trackId, 'pins'), pinContent);
    if (pinDocRef.id) {
      return { pinId: pinDocRef.id, pinContent: pinContent };
    }
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

// 刪除指定的Pin
export const deleteSelectedPin = async (pinInfo) => {
  console.log(pinInfo)
  const { tripId, trackId, pinId } = pinInfo;
  try {
    await deleteDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId));
    const pinSnap = await getDocs(collection(db, 'trips', tripId, 'tracks', trackId, 'pins'));
    let newPinIds = [];
    let newPinList = [];
    pinSnap.forEach(pin => {
      newPinIds.push(pin.id);
      newPinList.push(pin.data());
    });
    return { newPinIds: newPinIds, newPinList: newPinList };
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

// 紀錄目前的 mapCenter & zoom
export const saveMap = async (mapInfo) => {
  const { trackId, lat, lng, zoom } = mapInfo;
  try {
    await updateDoc(doc(db, 'tracks', trackId), {
      mapCenter: { lat: lat, lng: lng },
      zoom: zoom
    });
    const newTrackData = await getDoc(doc(db, 'tracks', trackId));
    return {
      mapCenter: newTrackData.data().mapCenter,
      zoom: newTrackData.data().zoom
    };
  } catch (err) {
    console.log('Error saving mapCenter', err);
  }
};

// 景點or路線筆記相關
// 取得筆記內容
export const getNotes = async (targetNotes) => {
  const { tripId, trackId, pinId } = targetNotes;
  try {
    const pinSnap = await getDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId));
    if (pinSnap.exists()) {
      return pinSnap.data().notes;
    }
  } catch (err) {
    console.log('Error getting notes', err);
  }
};
// 更新筆記內容
export const saveNotes = async (notesInfo) => {
  const { tripId, trackId, pinId, notes } = notesInfo;
  try {
    await updateDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId), {
      notes: notes
    });
  } catch (err) {
    console.log('Error updating notes', err);
  }
};

// 路線規劃相關
// 初次生成箭頭，自動產生最佳的路線選擇，回傳方式(用來顯示對應的icon)及所需時間
export const getDirection = (latitudeA, longitudeA, latitudeB, longitudeB) => {
  // 傳入前後兩點的經緯度，回傳建議的路線
  // 先return經緯度測試
  if (latitudeA == null || longitudeA == null || latitudeB == null || longitudeB == null) {
    return 'this is the last arrow, won\'t show any data';
  }
  return `${latitudeA}, ${longitudeA}, ${latitudeB}, ${longitudeB}`;
};

// 取得最近一次規劃路線選擇的方式＆所需時間（e.g. 步行，五分鐘），顯示在箭頭旁
export const getDirectionHistory = (tripName, day, id) => {
  // 先取得目前箭頭的狀態，若沒有先前儲存的路線紀錄，response null，有則顯示出來
  let data = getTripData(tripName);
  let directionList = data.dayTrack[day].directionList;
  let directionInfo = directionList[id];
  return directionInfo;
};

// 再次點擊路線規劃按鈕，取得該路線上一次紀錄的交通方式顯示出來（e.g. 步行，但google direction動態生成，因此可能實際內容會有改變）


// 當景點list上的先後順序改變，重新生成連線


// 載入 Google map
export const loadMap = (mapRegin, mapCenter, initMap, initMarker) => {
  let map = new window.google.maps.Map(mapRegin, {
    mapId: '6fe2140f54e6c7b3',
    mapTypeControl: false,
    center: mapCenter,
    zoom: 7
  });
  initMap(map);
  let marker = new window.google.maps.Marker({
    map,
    visible: false
  });
  initMarker(marker);
};

// 顯示 marker
export const showMarker = (marker, map, position) => {
  if(!marker.getVisible()) {
    map.setCenter(position);
    map.setZoom(14);
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
    }, 500);
  }
};

// 顯示 infoWindow
export const showInfoWindow = () => {

};