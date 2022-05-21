import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrackData, addToPinList, deleteSelectedPin, saveMap, updatePinListOrder, updateDirectionOptions } from '../../API';

export const fetchDayTrack = createAsyncThunk('trip/fetchDayTrack', async (targetTrack) => {
  const { tripId, trackIndex } = targetTrack;
  const dayTrack = await getTrackData(tripId, trackIndex);
  return dayTrack;
});

export const addNewPin = createAsyncThunk('trip/addNewPin', async (pinInfo) => {
  const newPin = await addToPinList(pinInfo);
  return newPin;
});

export const deletePin = createAsyncThunk('trip/deletePin', async (pinInfo) => {
  const newPins = await deleteSelectedPin(pinInfo);
  return newPins;
});

export const updateMapCenter = createAsyncThunk('trip/updateMapCenter', async (mapInfo) => {
  const mapCenter = await saveMap(mapInfo);
  return mapCenter;
});

export const reOrderPinList = createAsyncThunk('trip/reOrderPinList', async (newPinListInfo) => {
  const newPins = await updatePinListOrder(newPinListInfo);
  return newPins;
});

export const changeDirectionOptions = createAsyncThunk('trip/changeDirectionOptions', async (newDirectionInfo) => {
  const newDirections = await updateDirectionOptions(newDirectionInfo);
  return newDirections;
});

export const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    isFetching: true,
    isPinUpdating: false,
    isPathUpdating: false,
    tripId: null,
    trackId: null,
    mapCenter: null,
    zoom: null,
    pinIds: [],
    pinList: [],
    directions: []
  },
  reducers: {
    initTrackData: (state, action) => {
      const { tripId, trackId, mapCenter, zoom, pinIds, pinList, directions } = action.payload;
      if (mapCenter && zoom) {
        state.mapCenter = mapCenter;
        state.zoom = zoom;
      } else {
        state.mapCenter = { lat: 23.247797913420555, lng: 119.4327646617118 };
        state.zoom = 3;
      }
      state.tripId = tripId;
      state.trackId = trackId;
      state.pinIds = pinIds;
      state.pinList = pinList;
      state.directions = directions;
      state.isFetching = false;
    },
    clearPinList: (state) => {
      state.pinList = [];
    },
    upDateDirections: (state, action) => {
      state.directions = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDayTrack.pending, (state, action) => {
        state.isFetching = true;
      })
      .addCase(fetchDayTrack.fulfilled, (state, action) => {
        console.log('dayTrack data fetch success');
        const { tripId, trackId, mapCenter, zoom, pinIds, pinList, directions } = action.payload;
        console.log(action.payload);
        if (mapCenter && zoom) {
          state.mapCenter = mapCenter;
          state.zoom = zoom;
        } else {
          state.mapCenter = { lat: 23.247797913420555, lng: 119.4327646617118 };
          state.zoom = 3;
        }
        state.tripId =  tripId;
        state.trackId = trackId;
        state.pinIds = pinIds;
        state.pinList = pinList;
        state.directions = directions;
        state.isFetching = false;
      })
      .addCase(addNewPin.pending, (state) => {
        state.isPinUpdating = true;
      })
      .addCase(addNewPin.fulfilled, (state, action) => {
        const { pinId, pinContent, newDirections } = action.payload;
        state.pinIds.push(pinId);
        state.pinList.push(pinContent);
        state.directions = newDirections;
        state.isPinUpdating = false;
      })
      .addCase(deletePin.pending, (state) => {
        state.isPinUpdating = true;
      })
      .addCase(deletePin.fulfilled, (state, action) => {
        const { newPinIds, newPinList, newDirections } = action.payload;
        state.pinIds = newPinIds;
        state.pinList = newPinList;
        state.directions = newDirections;
        state.isPinUpdating = false;
      })
      .addCase(reOrderPinList.pending, (state) => {
        state.isPathUpdating = true;
      })
      .addCase(reOrderPinList.fulfilled, (state, action) => {
        const { newPinIds, newPinList } = action.payload;
        state.pinIds = newPinIds;
        state.pinList = newPinList;
        state.isPathUpdating = false;
      })
      .addCase(changeDirectionOptions.pending, (state, action) => {
        console.log('change direction choice pending');
      })
      .addCase(changeDirectionOptions.fulfilled, (state, action) => {
        console.log('update directions success');
        state.directions = action.payload;
      });
  }
});

export const { initTrackData, clearPinList, upDateDirections } = tripSlice.actions;
export default tripSlice.reducer;