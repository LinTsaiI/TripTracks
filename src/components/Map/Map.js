import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Tracks from '../Tracks/Tracks';
import Notes from '../Notes/Notes';
import Direction from '../Direction/Direction';

const Map = () => {
  const params = useParams();

  if (!params.day){
    return (
        <div>
          <h1>This is {params.place}'s Day1(Default) Map</h1>
          <Tracks />
          <Notes />
          <Direction />
        </div>
      )
  }
  return (
      <div>
        <h1>This is {params.place}'s Day{params.day} Map</h1>
        <Tracks />
        <Notes />
        <Direction />
      </div>
    )
}

export default Map;

// 進入地圖畫面，可看到 Tracks window（預設開啟）
// 