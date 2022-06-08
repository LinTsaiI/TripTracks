import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { addDoc, collection, doc, updateDoc, getDocs, query, deleteDoc, orderBy } from 'firebase/firestore';
import { getTrackData } from '../../utilities';

const addToPinList = async (pinInfo) => {
  const { tripId, trackId, currentPinListLength, placeName, address, lat, lng, photo, placeId, placeType, rating, voteNumber, newDirections } = pinInfo;
  try {
    const index = currentPinListLength ? currentPinListLength : 0;
    const pinContent = {
      index: index,
      name: placeName,
      address: address,
      position: { lat: lat, lng: lng },
      photo: photo,
      id: placeId,
      type: placeType,
      rating: rating ? rating : 0,
      voteNumber: voteNumber ? voteNumber : 0,
      notes: ''
    }
    const pinDocRef = await addDoc(collection(db, 'trips', tripId, 'tracks', trackId, 'pins'), pinContent);
    await updateDoc(doc(db, 'trips', tripId, 'tracks', trackId), {
      directions: newDirections
    });
    if (pinDocRef.id) {
      return { pinId: pinDocRef.id, pinContent: pinContent, newDirections: newDirections };
    }
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

const deleteSelectedPin = async (pinInfo) => {
  const { tripId, trackId, pinId, restPinIds, newDirections } = pinInfo;
  try {
    await deleteDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId));
    await updateDoc(doc(db, 'trips', tripId, 'tracks', trackId), {
      directions: newDirections
    });
    restPinIds.forEach((pinId, index) => {
      updateDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId), {
        index: index
      });
    });
    const condition = query(collection(db, 'trips', tripId, 'tracks', trackId, 'pins'), orderBy('index'));
    const pinSnap = await getDocs(condition);
    let newPinIds = [];
    let newPinList = [];
    pinSnap.forEach(pin => {
      newPinIds.push(pin.id);
      newPinList.push(pin.data());
    });
    return { newPinIds: newPinIds, newPinList: newPinList, newDirections: newDirections };
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

const updatePinListOrder = async (dndInfo) => {
  const { tripId, trackId, newPinIds } = dndInfo;
  try {
    newPinIds.forEach((pinId, index) => {
      updateDoc(doc(db, 'trips', tripId, 'tracks', trackId, 'pins', pinId), {
        index: index
      });
    })
    const condition = query(collection(db, 'trips', tripId, 'tracks', trackId, 'pins'), orderBy('index'));
    const pinSnap = await getDocs(condition);
    let pinIds = [];
    let newPinList = [];
    pinSnap.forEach(pin => {
      pinIds.push(pin.id);
      newPinList.push(pin.data());
    });
    return { newPinIds: pinIds, newPinList: newPinList };    
  } catch (err) {
    console.log('Error updating pinList order', err);
  }
};

const updateDirectionOptions = async (newDirectionInfo) => {
  const { tripId, trackId, newDirections } = newDirectionInfo;
  try {
    await updateDoc(doc(db, 'trips', tripId, 'tracks', trackId), {
      directions: newDirections
    });
    return newDirections;
  } catch (err) {
    console.log('Error updating directions', err);
  }
};

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
        state.mapCenter = mapCenter;
        state.zoom = zoom;
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