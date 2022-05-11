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
    trackId: null,
    mapCenter: null,
    zoom: null,
    pinList: null,
    directions: null
  },
  reducers: {
    setTrackId: (state, action) => {
      console.log(action.payload);
      state.trackId = action.payload;
    },
    initTrackDate: (state, action) => {
      const { mapCenter, zoom, pins, directions } = action.payload;
      if (mapCenter && zoom) {
        state.mapCenter = mapCenter;
        state.zoom = zoom;
      } else {
        state.mapCenter = { lat: 23.247797913420555, lng: 119.4327646617118 };
        state.zoom = 3;
      }
      state.pinList = pins;
      state.directions = directions;
    },
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
        console.log('dayTrack data fetch success');
        console.log(action.payload);
        if (action.payload.mapCenter && action.payload.zoom) {
          state.mapCenter = action.payload.mapCenter;
          state.zoom = action.payload.zoom;
        } else {
          state.mapCenter = { lat: 23.247797913420555, lng: 119.4327646617118 };
          state.zoom = 3;
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

export const { setTrackId, initTrackDate, savePreviousTrackState } = tripSlice.actions;
export default tripSlice.reducer;