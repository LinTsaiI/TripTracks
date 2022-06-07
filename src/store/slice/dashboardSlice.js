import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { addDoc, serverTimestamp, collection, doc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const getTripList = async (userId) => {
  const condition = query(collection(db, 'trips'), where('userId', '==', userId));
  const querySnapshot = await getDocs(condition);
  let tripList = [];
  querySnapshot.forEach(doc => {
    let trip = {
      tripId: doc.id,
      destination: doc.data().destination,
      destinationLatLng: doc.data().destinationLatLng,
      tripName: doc.data().tripName,
      startDate: doc.data().startDate,
      endDate: doc.data().endDate,
      cover: doc.data().cover
    };
    tripList.push(trip);
  });
  return tripList;
};

const getRandomPhoto = () => {
  return fetch(`https://api.unsplash.com/photos/random?query=nature&count=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`, {method: 'GET'})
    .then(response => response.json()) 
    .then(result => result[0].urls.thumb)
    .catch(e => {
      console.log('err', e);
    });
}

const createNewTrip = async (newTrip) => {
  const { userId, destination, destinationLatLng, tripName, startDate, endDate } = newTrip;
  const coverImg = await getRandomPhoto();
  try {
    const docRef = await addDoc(collection(db, 'trips'), {
      userId: userId,
      timestamp: serverTimestamp(),
      destination: destination,
      destinationLatLng: destinationLatLng,
      tripName: tripName,
      startDate: startDate,
      endDate: endDate,
      cover: coverImg
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
          mapCenter: destinationLatLng,
          zoom: 9,
          directions: []
        });
      }
      return docRef.id;
    }
  } catch (err) {
    console.log('Error creating new trip: ', err);
  }
};

const deleteSelectPlan = async (planInfo) => {
  const { userId, tripId } = planInfo;
  try {
    await deleteDoc(doc(db, 'trips', tripId));
    await updateDoc(doc(db, 'user', userId), {
      tripId: arrayRemove(tripId)
    });
    const newTripList = await getTripList(userId);
    return newTripList;
  } catch (err) {
    console.log('Error updating pinList', err);
  }
};

export const asyncFetchTripList = createAsyncThunk('dashboard/asyncFetchTripList', async (userId) => {
  const tripList = await getTripList(userId);
  return tripList;
});

export const asyncCreateNewTrip = createAsyncThunk('dashboard/asyncCreateNewTrip', async (newTrip) => {
  const tripId = await createNewTrip(newTrip);
  return tripId;
});

export const asyncDeleteTrip = createAsyncThunk('dashboard/asyncDeleteTrip', async (tripInfo) => {
  const newTripList = await deleteSelectPlan(tripInfo);
  return newTripList;
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tripList: [],
    newtTripId: null,
    isProcessing: false,
    isNewTrip: false,
  },
  reducers: {
    resetNewTrip: (state) => {
      state.isNewTrip = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(asyncFetchTripList.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncFetchTripList.fulfilled, (state, action) => {
        state.tripList = action.payload;
        state.isProcessing = false;
      })
      .addCase(asyncCreateNewTrip.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncCreateNewTrip.fulfilled, (state, action) => {
        state.newtTripId = action.payload;
        state.isProcessing = false;
        state.isNewTrip = true;
      })
      .addCase(asyncDeleteTrip.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(asyncDeleteTrip.fulfilled, (state, action) => {
        state.tripList = action.payload;
        state.isProcessing = false;
      });
  }
});

export const { resetNewTrip } = dashboardSlice.actions;
export default dashboardSlice.reducer;