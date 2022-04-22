import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { switchDirection, getDirectionChoice } from '../../store/slice/directionSlice';
import { hideNotes } from '../../store/slice/notesSlice';
import './Arrow.css';

const Arrow = ({ index, number }) => {
  const params = useParams();
  const day = params.day;
  const dispatch = useDispatch();
  const tripData = useSelector(state => state.trip.tripData);
  let directionList;
  let pinList;
  if (!day) {
    pinList = tripData.dayTrack[0].pinList;
    directionList = tripData.dayTrack[0].directionList;
  } else {
    pinList = tripData.dayTrack[day-1].pinList;
    directionList = tripData.dayTrack[day-1].directionList;
  }

  let arrowClassName;
  let way;
  let time;
  let pinAName;
  let pinBName;
  let latA;
  let longA;
  let latB;
  let longB;
  if (index == number - 1 ) {   // 若為最後一個箭頭，不顯示
    arrowClassName = 'arrow-display-none';
    pinAName = '';   // 無需pin name
    pinBName = '';
    way = '';   // way & time 無資料，顯示空白避免 error
    time = '';
    latA = null;   // 經緯度無需pass資料，設定null
    longA = null;
    latB = null;
    longB = null;
  } else {
    arrowClassName = 'arrow';
    pinAName = pinList[index].name;
    pinBName = pinList[index+1].name;
    way = directionList[index].way;
    time = directionList[index].time;
    latA = pinList[index].lat;
    longA = pinList[index].long;
    latB = pinList[index+1].lat;
    longB = pinList[index+1].long;
  }
  const handelDirection = (e) => {
    dispatch(hideNotes());
    dispatch(switchDirection({
      id: e.target.parentNode.id
    }));
    dispatch(getDirectionChoice({
      start: pinAName,
      end: pinBName,
      latA: latA,
      longA: longA,
      latB: latB,
      longB: longB,
    }));
  }

  return (
    <div
      className={arrowClassName}
      id={index}
      onClick={e => handelDirection(e)}
    >
      <div>&#8595;</div>
      <div>{way}</div>
      <div>{time}</div>
    </div>
  )
}

export default Arrow;