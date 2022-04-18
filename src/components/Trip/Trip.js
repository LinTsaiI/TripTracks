import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';
import { updateTripData } from '../../store/slice/tripSlice';
import Days from './Days';
import Footer from '../Footer/Footer';
import { getTripData } from '../../API';

const Trip = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [tripData] = useState(getTripData(params.place));

  useEffect(() => {
    dispatch(updateTripData({ tripData: tripData }));
  }, [tripData])

  return(
    <div>
      <nav>
        <h1>{tripData.tripName}</h1>
        <Days tripName={tripData.tripName} duration={tripData.duration}/>
      </nav>
      <Outlet />
      <Footer />
    </div>
  )
}

export default Trip;

// 進入行程頁面，call API取得該使用者下對應的行程名稱資訊：開始日期，停留天數
// 開始地圖預設拉很遠的大圖