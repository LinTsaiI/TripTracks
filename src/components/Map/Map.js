import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Tracks from '../Tracks/Tracks';

const Map = () => {
  let params = useParams();
  if (!params.place) {
    return <Navigate to='/dashboard'/>
  } else {
    return params.day
      ? (
        <div>
          <h1>This is {params.place}'s Day{params.day} Map</h1>
          <Tracks />
        </div>
      )
      : (
        <div>
          <h1>This is {params.place}'s Day1(Default) Map</h1>
          <Tracks />
        </div>
      )
  }
}

export default Map;

// 進入地圖畫面，可看到 Tracks window（預設開啟）
// 