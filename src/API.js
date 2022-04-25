import { getDatabase, ref, set } from "firebase/database";
// import { GoogleAuthProvider, linkWithRedirect, getRedirectResult, getAuth, signInWithCustomToken, signOut } from "firebase/auth";

// const googleProvider = new GoogleAuthProvider();
// const auth = getAuth();
// linkWithRedirect(auth.currentUser, provider)
//   .then(/* ... */)
//   .catch(/* ... */);
// getRedirectResult(auth).then((result) => {
//   const credential = GoogleAuthProvider.credentialFromResult(result);
//   if (credential) {
//     // Accounts successfully linked.
//     const user = result.user;
//     // ...
//   }
// }).catch((error) => {
//   // Handle Errors here.
//   // ...
// });


// signInWithCustomToken(auth, token)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });

// signOut(auth).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });

// 使用者身份相關（進入每個頁面都要驗證身份）
// 登入
export const userSignIn = (userName, password) => {
  // fetch 資料庫，查看是否有該名使用者
  console.log(userName, password);
  // 有的話response ok
  return true;
}
// 註冊
export const userSignUp = (userName, email, password) => {
  // fetch 資料庫，查看是否有已有相同email被註冊
  console.log(userName, email, password);
  // 沒有的話把資料新增到資料庫，response ok
  return true;
}

// 取得使用者名稱/email(帳號)/會員id
// 更新密碼


// 行程資訊相關
// 點擊 start to plan 新增行程，將 tripName, startDate, duration 加入資料庫
export const createNewTripToDb = (tripName, startDate, duration) => {
  // fetch 資料庫，成功加入資料庫 response ok: true
  console.log(tripName, startDate, duration);
  const db = getDatabase();
  set(ref(db, 'trips'), {
    tripName: tripName,
    startDate: startDate,
    duration: duration
  })
  return true;
}
// 取得使用者已建立的所有行程，用以在 Dashboard 顯示行程名稱/日期區間
export const getTripList = (memberId) => {
  // fetch 資料庫，有取到回一個list，沒取到回null
  let tripList;
  if (memberId == '123') {
    tripList = [
      {
        tripId: '1234',
        tripName: 'Tokyo',
        startDate: 'Apr 30, 2022',
        endDate: 'May 04, 2022',
        duration: 5,
        cover: ''
      },
    // {
    //   tripName: 'New York',
    //   startDate: 'Jun 15, 2022',
    //   endDate: 'Jun 24, 2022',
    //   duration: 10,
    //   cover: ''
    // },
    // {
    //   tripName: 'Bangkok',
    //   startDate: 'Feb 01, 2023',
    //   endDate: 'Feb 07, 2022',
    //   duration: 7,
    //   cover: ''
    // },
    ]
    return tripList;
  }
}
// 取得特定行程的所有資訊，用以顯示行程名稱/天數/日期區間/當天景點list/地圖上的marker位置
export const getTripData = (tripName) => {
  // fetch 資料庫符合tripName (實際應用tripId) 的行程資訊
  let tripData;
  if(tripName == 'Tokyo') {
    tripData = {
      tripName: 'Tokyo',
      startDate: 'Apr 30, 2022',
      endDate: 'May 04, 2022',
      duration: 5,
      cover: '',
      dayTrack: [   // 一天一個object紀錄marker等細節
        {
          pinList: [  // 每個list列出儲存的點，經緯度，箭頭資訊
            {
              name: '東京鐵塔',
              lat: '35.658737390271604',
              long: '139.74542216860036',
              notes: {
                content: '東京鐵塔伴手禮'
              }
            },
            {
              name: '東京車站',
              lat: '35.68155091323363',
              long: '139.7671054258442',
              notes: {
                content: '東京車站伴手禮'
              }
            },
            {
              name: '皇居',
              lat: '35.68565607983227',
              long: '139.7528747159775',
              notes: {
                content: '皇居伴手禮'
              }
            }
          ],
          directionList: [   // 列出該天的箭頭資訊
            {
              way: 'mrt',
              time: '30 min'
            },
            {
              way: 'walk',
              time: '35 min'
            }
          ]
        },
        {
          pinList: [
            {
              name: '下北澤',
              lat: '35.66289774702003',
              long: '139.66706218520682',
              notes: {
                content: '下北澤伴手禮'
              }
            },
            {
              name: '吉祥寺',
              lat: '35.70354156394838',
              long: '139.57990051293342',
              notes: {
                content: '吉祥寺伴手禮'
              }
            },
            {
              name: '吉卜力博物館',
              lat: '35.696394816236165',
              long: '139.57049607045548',
              notes: {
                content: '吉卜力博物館伴手禮'
              }
            },
          ],
          directionList: [
            {
              way: 'train',
              time: '40 min'
            },
            {
              way: 'train',
              time: '60 min'
            }
          ]
        },
        {
          pinList: [
            {
              name: '淺草寺',
              lat: '35.715297849839985',
              long: '139.79683870189155',
              notes: {
                content: '淺草寺伴手禮'
              }
            },
            {
              name: '晴空塔',
              lat: '35.71028918176141',
              long: ' 139.810657482093',
              notes: {
                content: '晴空塔伴手禮'
              }
            },
          ],
          directionList: [
            {
              way: 'walk',
              time: '35 min'
            },
          ]
        },
        {
          pinList: [
            {
              name: '東京迪士尼海洋',
              lat: '35.6268590321797',
              long: '139.8850993551084',
              notes: {
                content: '東京迪士尼海洋伴手禮'
              }
            },
            {
              name: '築地市場',
              lat: '35.66864892878142',
              long: '139.7702412260595',
              notes: {
                content: '築地市場伴手禮'
              }
            },
          ],
          directionList: [
            {
              way: 'mrt',
              time: '50 min'
            },
          ]
        },
        {
          pinList: [
            {
              name: '新宿',
              lat: '35.68989224661832',
              long: '139.70047869879102',
              notes: {
                content: '新宿伴手禮'
              }
            },
            {
              name: '竹下通',
              lat: '35.67125657676321',
              long: '139.70519805510946',
              notes: {
                content: '竹下通伴手禮'
              }
            },
            {
              name: '明治神宮',
              lat: '35.67919150764017',
              long: '139.69939833772688',
              notes: {
                content: '明治神宮伴手禮'
              }
            },
          ],
          directionList: [
            {
              way: 'mrt',
              time: '25 min'
            },
            {
              way: 'walk',
              time: '30 min'
            }
          ]
        },
      ]
    }
    return tripData;
  // } else if(tripName == 'New York') {
  //   return tripData = {
  //     tripName: 'New York',
  //     startDate: 'Jun 15, 2022',
  //     endDate: 'Jun 21, 2022',
  //     duration: 7,
  //     cover: '',
  //     dayTrack: [   // 一天一個object紀錄marker等細節
  //       {
  //         pinList: [  // 每個list列出儲存的點，經緯度...
  //           '自由女神像'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '第五大道'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '華爾街'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '帝國大廈'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '百老匯'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '中央公園'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '布魯克林大橋'
  //         ],
  //       },
  //     ]
  //   }
  // } else if(tripName == 'Bangkok') {
  //   return tripData = {
  //     tripName: 'Bangkok',
  //     startDate: 'Feb 01, 2023',
  //     endDate: 'Feb 05, 2022',
  //     duration: 5,
  //     cover: '',
  //     dayTrack: [   // 一天一個object紀錄marker等細節
  //       {
  //         pinList: [  // 每個list列出儲存的點，經緯度...
  //           '曼谷清真寺'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '水上市集'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '火車市集'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '洽圖洽市集'
  //         ],
  //       },
  //       {
  //         pinList: [
  //           '大佛寺'
  //         ],
  //       },
  //     ]
  //   }
  }
}
// 刪除指定的Pin
export const deleteSelectedPin = (tripName, day, id) => {
  // fetch 資料庫，將該會員對應到 tripName, day, pin id的景點刪除
  let data = getTripData(tripName);
  let pinList = data.dayTrack[day].pinList;
  pinList.splice(id, 1);
  // 刪除成功 response ok
  // 此時若 getTripData(tripName) 抓到的景點資料就會更新。此處先以回傳更改過的tripData替代
  return pinList;
}

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
}
// 更新筆記內容
export const saveNotes = () => {

}


// 路線規劃相關
// 初次生成箭頭，自動產生最佳的路線選擇，回傳方式(用來顯示對應的icon)及所需時間
export const getDirection = (latitudeA, longitudeA, latitudeB, longitudeB) => {
  // 傳入前後兩點的經緯度，回傳建議的路線
  // 先return經緯度測試
  if (latitudeA == null || longitudeA == null || latitudeB == null || longitudeB == null) {
    return 'this is the last arrow, won\'t show any data';
  }
  return `${latitudeA}, ${longitudeA}, ${latitudeB}, ${longitudeB}`;
}

// 取得最近一次規劃路線選擇的方式＆所需時間（e.g. 步行，五分鐘），顯示在箭頭旁
export const getDirectionHistory = (tripName, day, id) => {
  // 先取得目前箭頭的狀態，若沒有先前儲存的路線紀錄，response null，有則顯示出來
  let data = getTripData(tripName);
  let directionList = data.dayTrack[day].directionList;
  let directionInfo = directionList[id];
  return directionInfo;
}

// 再次點擊路線規劃按鈕，取得該路線上一次紀錄的交通方式顯示出來（e.g. 步行，但google direction動態生成，因此可能實際內容會有改變）


// 當景點list上的先後順序改變，重新生成連線