import { auth, db, provider } from './firebase';
import { sendSignInLinkToEmail, signInWithPopup  } from 'firebase/auth';
import { setDoc, addDoc, Timestamp, collection, doc, updateDoc, getDoc, arrayUnion, getDocs, query, where } from 'firebase/firestore';


// 使用者身份相關（進入每個頁面都要驗證身份）
// 登入
export const userSignIn = (userName, password) => {
  // fetch 資料庫，查看是否有該名使用者
  console.log(userName, password);
  // 有的話response ok
  return true;
};
// 註冊
export const userSignUp = (userName, email, password) => {
  // fetch 資料庫，查看是否有已有相同email被註冊
  console.log(userName, email, password);
  // 沒有的話把資料新增到資料庫，response ok
  return true;
};

// 取得使用者名稱/email(帳號)/會員id
// 更新密碼

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
          FirstEntryTime: Timestamp.now()
        });
        console.log('create');
      } catch (err) {
        console.error('Error adding document: ', err);
      }
    }
  } catch (err) {
    console.error('Error adding document: ', err);
  }
};


// 行程資訊相關
// 點擊 start to plan 新增行程，將 tripName, startDate, duration 加入資料庫
export const createNewTrip = async (userId, tripName, startDate, duration, setTripId, setCreateStatus) => {
  // fetch 資料庫，成功加入資料庫 response ok: true
  try {
    const docRef = await addDoc(collection(db, 'trips'), {
      userId: userId,
      tripName: tripName,
      startDate: startDate,
      duration: duration,
      trackId: []
    });
    if (docRef.id) {
      updateDoc(doc(db, 'user', userId), {
        tripId: arrayUnion(docRef.id)
      });
    }
    createNewTrack(userId, docRef.id, duration);
    setTripId(docRef.id);
    setCreateStatus(true);
  } catch (err) {
    console.log('Error adding document: ', err);
  }
};

// 建立新 trip，同時依天數建立空的 track 文件
export const createNewTrack = async (userId, tripId, duration) => {
  try {
    const docContent = {
      userId: userId,
      tripId: tripId,
      mapCenter: {lat: 0, lng: 0},
      zoom: 0,
      pins: [],
      directions: []
    };
    for (let i = 0; i < duration; i++) {
      const docRef = await addDoc(collection(db, 'tracks'), docContent);
      if (docRef.id) {
        updateDoc(doc(db, 'trips', tripId), {
          trackId: arrayUnion(docRef.id)
        });
      }
    }
  } catch (err) {
    console.log('Error adding document: ', err);
  }
};

// 取得使用者已建立的所有行程，用以在 Dashboard 顯示行程名稱/日期區間
export const getTripList = async (userId) => {
  const condition = query(collection(db, 'trips'), where('userId', '==', userId));
  const querySnapshot = await getDocs(condition);
  let tripList = [];
  querySnapshot.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    let trip = {
      tripId: doc.id,
      tripName: doc.data().tripName,
      startDate: doc.data().startDate,
      duration: doc.data().duration
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
  // fetch 資料庫符合 tripId 的行程資訊
  // let tripData;
  // if(tripId == 'e4uScTLClSzVNcGsFOCE') {
  //   tripData = {
  //     tripName: 'Tokyo',
  //     startDate: 'Apr 30, 2022',
  //     endDate: 'May 04, 2022',
  //     duration: 5,
  //     cover: '',
  //     dayTrack: [   // 一天一個object紀錄marker等細節
  //       {
  //         pinList: [  // 每個list列出儲存的點，經緯度，箭頭資訊
  //           {
  //             name: '東京鐵塔',
  //             lat: '35.658737390271604',
  //             long: '139.74542216860036',
  //             notes: {
  //               content: '東京鐵塔伴手禮'
  //             }
  //           },
  //           {
  //             name: '東京車站',
  //             lat: '35.68155091323363',
  //             long: '139.7671054258442',
  //             notes: {
  //               content: '東京車站伴手禮'
  //             }
  //           },
  //           {
  //             name: '皇居',
  //             lat: '35.68565607983227',
  //             long: '139.7528747159775',
  //             notes: {
  //               content: '皇居伴手禮'
  //             }
  //           }
  //         ],
  //         directionList: [   // 列出該天的箭頭資訊
  //           {
  //             way: 'mrt',
  //             time: '30 min'
  //           },
  //           {
  //             way: 'walk',
  //             time: '35 min'
  //           }
  //         ]
  //       },
};

// 進入 /trip/tripId?day= 頁面，載入該天的景點list/地圖上的marker位置
export const getTrackData = async (trackId) => {
  try {
    const trackSnap = await getDoc(doc(db, 'tracks', trackId));
    if (trackSnap.exists()) {
      return trackSnap.data();
    }
  } catch (err) {
    console.log('Error getting document: ', err);
  }
};

// 將景點加入 pinList
export const addToPinList = async (pinInfo) => {
  const { trackId, placeName, lat, lng, address, photo } = pinInfo;
  console.log('add pin in: ', trackId);
  try {
    await updateDoc(doc(db, 'tracks', trackId), {
      pins: arrayUnion({
        name: placeName,
        position: { lat: lat, lng: lng },
        address: address,
        photo: photo,
        notes: ''
      })
    });
    const newTrackSnap = await getDoc(doc(db, 'tracks', pinInfo.trackId));
    return newTrackSnap.data().pins;
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

// 刪除指定的Pin
export const deleteSelectedPin = async (pinInfo) => {
  const { trackId, targetIndex } = pinInfo;
  console.log('delete pin in: ', trackId);
  try {
    const trackSnap = await getDoc(doc(db, 'tracks', trackId));
    const pinList = trackSnap.data().pins;
    pinList.splice(targetIndex, 1);
    await updateDoc(doc(db, 'tracks', trackId), {
      pins: pinList
    });
    const newTrackSnap = await getDoc(doc(db, 'tracks', trackId));
    return newTrackSnap.data().pins;
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

// 紀錄目前的 mapCenter
export const saveMapCenter = async (mapInfo) => {
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
export const getNotes = (tripName, day, id) => {
  // fetch 資料庫，將該會員對應到 tripName, day, pin id的筆記內容抓出來
  let data = getTripData(tripName);
  let pinList = data.dayTrack[day].pinList;
  let pinName = pinList[id].name;
  let content = pinList[id].notes.content;
  // 有取到回一個object，沒取到回null
  return [pinName, content];
};
// 更新筆記內容
export const saveNotes = () => {

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