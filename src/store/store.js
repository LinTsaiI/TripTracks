import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import newTripReducer from './slice/newTripSlice';
import tripReducer from './slice/tripSlice';
import directionReducer from './slice/directionSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    newTrip: newTripReducer,
    trip: tripReducer,
    direction: directionReducer
  },
});