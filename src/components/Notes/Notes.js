import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { MapContentContext } from '../MapContent/MapContent';
import './Notes.css';

const Notes = () => {
  const notesState = useSelector(state => state.notes);
  const pinList = useSelector(state => state.trip.pinList);
  const value = useContext(MapContentContext);
  const { isNoteOpen, setIsNoteOpen, currentFocusNote } = value;
  const focusIndex = currentFocusNote ? currentFocusNote : 0;
  const notesClassName  = isNoteOpen ? 'notes-container' : 'display-none';

  if (!pinList) {
    return <div>Loading...</div>
  } else if (pinList.length > 1) {
    return (
      <div className={notesClassName}>
        <div className='notes-top-part'>
          <div className='notes-title'>
            <div className='notes-img'/>
            <div>Notes</div>
          </div>
          <div className='notes-pin-name'>{pinList[focusIndex].name}</div>
        </div>
        <textarea type='textarea' className='notes-input-field'/>
      </div>
    );
  }
}

export default Notes;

/* 做筆記框框
1. 可由規劃路線視窗點擊切換顯示在相同視窗位置
2. 點擊加入景點清單之單一景點右手邊的Notes圖示，會在地圖上該圖示旁跳出筆記視窗
3. 地圖上該景點圖示，跳出Notes及規劃路線按鈕，點擊Notes按鈕跳出筆記視窗
*/
