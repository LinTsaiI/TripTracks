import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import tripReducer from './slice/tripSlice';
import directionReducer from './slice/directionSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    trip: tripReducer,
    direction: directionReducer
  },
});