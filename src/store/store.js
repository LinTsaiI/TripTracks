import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/userSlice';
import newTripReducer from './slice/newTripSlice';
import dashBoardReducer from './slice/dashboardSlice';
import tripReducer from './slice/tripSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    newTrip: newTripReducer,
    dashboard: dashBoardReducer,
    trip: tripReducer,
  },
})