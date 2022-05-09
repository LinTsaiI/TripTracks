import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrackData, addToPinList, deleteSelectedPin, saveMapCenter } from '../../API';

export const fetchDayTrack = createAsyncThunk('trip/fetchDayTrack', async (trackId) => {
  const dayTrack = await getTrackData(trackId);
  return dayTrack;
});

export const addNewPin = createAsyncThunk('trip/addNewPin', async (pinInfo) => {
  const newPinList = await addToPinList(pinInfo);
  return newPinList;
});

export const deletePin = createAsyncThunk('trip/deletePin', async (pinInfo) => {
  const newPinList = await deleteSelectedPin(pinInfo);
  return newPinList;
});

export const updateMapCenter = createAsyncThunk('trip/updateMapCenter', async (mapInfo) => {
  const mapCenter = await saveMapCenter(mapInfo);
  return mapCenter;
});

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    // tripData: null,
    trackId: null,
    mapCenter: { lat: 23.247797913420555, lng: 119.4327646617118 },
    zoom: 3,
    pinList: null,
    directions: null
  },
  reducers: {
    setTrackId: (state, action) => {
      console.log(action.payload);
      state.trackId = action.payload;
    },
    // setTripData: (state, actions) => {
    //   let tripData = actions.payload.tripData;
    //   state.tripData = tripData;
    // },
    setDayTrack: (state, actions) => {
      let trackId = actions.payload.trackId;
      let dayTrack = actions.payload.dayTrack;
      state.trackId = trackId;
      state.dayTrack = dayTrack;
    },
    // updateDayTrack: (state, actions) => {
    //   let dayTrack = actions.payload.dayTrack;
    //   state.dayTrack = dayTrack;
    // },
    // 切換不同天的行程時，需將上一個行程的狀態 e.g. mapCenter 記錄下來並更新到資料庫
    savePreviousTrackState: (state, actions) => {
      console.log('save previous dayTrack state, target: ', state.trackId);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDayTrack.pending, (state, action) => {
        console.log('fetch day track pending');
        // state.status = 'loading'
      })
      .addCase(fetchDayTrack.fulfilled, (state, action) => {
        console.log('success');
        console.log(action.payload);
        if (action.payload.mapCenter) {
          state.mapCenter = action.payload.mapCenter;
        }
        if (action.payload.zoom) {
          state.zoom = action.payload.zoom;
        }
        state.pinList = action.payload.pins;
        state.directions = action.payload.directions;
      })
      .addCase(addNewPin.pending, (state, action) => {
        console.log('add new pin pending');
      })
      .addCase(addNewPin.fulfilled, (state, action) => {
        console.log(action.payload);
        state.pinList = action.payload;
      })
      .addCase(deletePin.pending, (state, action) => {
        console.log('delete pin pending');
      })
      .addCase(deletePin.fulfilled, (state, action) => {
        console.log(action.payload);
        state.pinList = action.payload;
      })
      .addCase(updateMapCenter.pending, (state, action) => {
        console.log('save map center pending');
      })
      .addCase(updateMapCenter.fulfilled, (state, action) => {
        console.log(action.payload);
        state.mapCenter = action.payload.mapCenter;
        state.zoom = action.payload.zoom;
      })
  }
});

export const { setTrackId, setTripData, setDayTrack, updateDayTrack, savePreviousTrackState } = tripSlice.actions;
export default tripSlice.reducer;


// Trip 中的 tripData 要視 params 動態由 getTripData() 取得，是否可以集中在 store 管理？