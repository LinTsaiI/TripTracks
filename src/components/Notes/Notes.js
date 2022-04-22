import React from 'react';
import { useSelector } from 'react-redux';
import './Notes.css';

const Notes = () => {
  const notesState = useSelector(state => state.notes);
  const notesClassName  = notesState.isOpen ? 'notes-container' : 'display-none';

  return (
    <div className={notesClassName}>
      <div className='notes-top-part'>
        <div className='notes-title'>
          <div className='notes-img'/>
          <div>Notes</div>
        </div>
        <div className='notes-pin-name'>{notesState.notesName}</div>
      </div>
      <textarea type='textarea' className='notes-input-field' defaultValue={notesState.content}/>
    </div>
  )
}

export default Notes;

/* 做筆記框框
1. 可由規劃路線視窗點擊切換顯示在相同視窗位置
2. 點擊加入景點清單之單一景點右手邊的Notes圖示，會在地圖上該圖示旁跳出筆記視窗
3. 地圖上該景點圖示，跳出Notes及規劃路線按鈕，點擊Notes按鈕跳出筆記視窗
*/
