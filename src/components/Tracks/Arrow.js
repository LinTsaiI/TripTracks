import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchDirection, getDirectionChoice } from '../../store/slice/directionSlice';
import { hideNotes } from '../../store/slice/notesSlice';
import './Arrow.css';

const Arrow = ({ index }) => {
  const dispatch = useDispatch();
  const dayTrack = useSelector(state => state.trip.dayTrack);

  let arrowClassName;
  let way;
  let time;
  let pinAName;
  let pinBName;
  let latA;
  let lngA;
  let latB;
  let lngB;
  if (index == dayTrack.pins.length - 1 ) {   // 若為最後一個箭頭，不顯示
    arrowClassName = 'arrow-display-none';
    // pinAName = '';   // 無需pin name
    // pinBName = '';
    // way = '';   // way & time 無資料，顯示空白避免 error
    // time = '';
    // latA = null;   // 經緯度無需pass資料，設定null
    // lngA = null;
    // latB = null;
    // lngB = null;
  } else {
    arrowClassName = 'arrow';
    pinAName = dayTrack.pins[index].name;
    pinBName = dayTrack.pins[index+1].name;
    // way = directions[index].way;
    // time = directions[index].time;
    latA = dayTrack.pins[index].lat;
    lngA = dayTrack.pins[index].lng;
    latB = dayTrack.pins[index+1].lat;
    lngB = dayTrack.pins[index+1].lng;
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
      lngA: lngA,
      latB: latB,
      lngB: lngB,
    }));
  }

  return (
    <div
      className={arrowClassName}
      id={index}
      onClick={e => handelDirection(e)}
    >
      <div>&#8595;</div>
      {/* <div>{way}</div>
      <div>{time}</div> */}
    </div>
  )
}

export default Arrow;