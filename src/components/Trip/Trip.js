import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { updateTripData } from '../../store/slice/tripSlice';
import TripHeader from './TripHeader';
import Footer from '../Footer/Footer';

const Trip = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const tripData = useSelector(state => state.trip.tripData);

  useEffect(() => {
    dispatch(updateTripData({ tripName: params.place }));
  }, [])

  if (!params.place) {
    return <Navigate to='/dashboard'/>
  } else {
    return !tripData ? <div>Loading...</div> : (
      <div>
        <nav>
          <TripHeader />
        </nav>
        <Outlet />
        <Footer />
      </div>
    )
  }
}

export default Trip;

// 進入行程頁面，call API取得該使用者下對應的行程名稱資訊：開始日期，停留天數
// 開始地圖預設拉很遠的大圖