// 使用者身份相關（進入每個頁面都要驗證身份）
// 取得使用者名稱/email(帳號)/會員id
// 更新密碼


// 行程資訊相關
// 點擊 start to plan 新增行程，將 tripName, startDate, duration 加入資料庫
export const createNewTripToDb = (tripName, startDate, duration) => {
  // fetch 資料庫，成功加入資料庫 response ok: true
  console.log(tripName, startDate, duration)
  return true;
}
// 取得使用者已建立的所有行程，用以在 Dashboard 顯示行程名稱/日期區間
export const getTripList = () => {
  // fetch 資料庫，有取到回一個list，沒取到回null
  let tripList = [
    {
      tripName: 'Tokyo',
      startDate: 'Apr 30, 2022',
      endDate: 'May 04, 2022',
      duration: 5,
      cover: ''
    },
    {
      tripName: 'New York',
      startDate: 'Jun 15, 2022',
      endDate: 'Jun 24, 2022',
      duration: 10,
      cover: ''
    },
    {
      tripName: 'Bangkok',
      startDate: 'Feb 01, 2023',
      endDate: 'Feb 07, 2022',
      duration: 7,
      cover: ''
    }
  ]
  return tripList;
}
// 取得特定行程的所有資訊，用以顯示行程名稱/天數/日期區間/當天景點list/地圖上的marker位置
export const getTripData = (tripName) => {
  // fetch 資料庫符合tripName的行程資訊
  let tripData;
  if(tripName == 'Tokyo') {
    tripData = {
      tripName: 'Tokyo',
      startDate: 'Apr 30, 2022',
      endDate: 'May 04, 2022',
      duration: 5,
      cover: '',
      DayTrack: [   // 一天一個object紀錄marker等細節
        {
          pinList: [  // 每個list列出儲存的點，經緯度...
            '東京鐵塔', '東京車站', '皇居'
          ],

        },
        {
          pinList: [
            '下北澤', '吉祥寺', '吉卜力博物館'
          ],

        },
        {
          pinList: [
            '淺草寺', '晴空塔'
          ],

        },
        {
          pinList: [
            '東京迪士尼海洋', '築地市場'
          ],

        },
        {
          pinList: [
            '新宿', '竹下通', '明治神宮'
          ],

        },
      ]
    }
    return tripData;
  } else if(tripName == 'New York') {
    return tripData = {
      tripName: 'New York',
      startDate: 'Jun 15, 2022',
      endDate: 'Jun 24, 2022',
      duration: 10,
      cover: '',
      DayTrack: [   // 一天一個object紀錄marker等細節
        {
          pinList: [],

        },
      ]
    }
  } else if(tripName == 'Bangkok') {
    return tripData = {
      tripName: 'Bangkok',
      startDate: 'Feb 01, 2023',
      endDate: 'Feb 07, 2022',
      duration: 7,
      cover: '',
      DayTrack: [   // 一天一個object紀錄marker等細節
        {
          pinList: [],

        },
      ]
    }
  }
}


// 景點or路線筆記相關
// 取得筆記內容
// 更新筆記內容


// 路線規劃相關
// 紀錄最近一次規劃路線選擇的方式＆所需時間（e.g. 步行，五分鐘）
// 再次點擊路線規劃按鈕，取得該路線上一次紀錄的交通方式顯示出來（e.g. 步行，但google direction動態生成，因此可能實際內容會有改變）


// 當景點list上的先後順序改變，重新生成連線