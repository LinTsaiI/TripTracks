import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import dashboardReducer from './slice/dashboardSlice';
import tripReducer from './slice/tripSlice';
import directionReducer from './slice/directionSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    dashboard: dashboardReducer,
    trip: tripReducer,
    direction: directionReducer
  },
});