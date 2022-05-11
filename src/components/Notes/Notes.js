import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotes } from '../../API';
import { TripContext } from '../Trip/Trip';
import './Notes.css';

const Notes = () => {
  // const [notes, setNotes] = useState('');
  // const [saveBtnClassName, setSaveBtnClassName] = useState('display-none');
  // const [isSaved, setIsSaved] = useState(false);
  const notesState = useSelector(state => state.notes);
  const dayTrack = useSelector(state => state.trip);
  const dispatch = useDispatch();
  const value = useContext(TripContext);
  const { isNoteOpen, setIsNoteOpen, currentFocusNote } = value;
  const focusIndex = currentFocusNote ? currentFocusNote : 0;
  const notesClassName  = isNoteOpen ? 'notes-container' : 'display-none';
  // const savedClassName = isSaved ? 'saved' : 'display-none';

  // useEffect(() => {
  //   getNotes(dayTrack.trackId, dayTrack.pinList[focusIndex].id)
  //     .then(notes => {
  //       console.log('get notes')
  //       setNotes(notes);
  //     })
  // }, [focusIndex]);

  // const handelInputChange = (e) => {
  //   setNotes(e.target.value);
  //   setSaveBtnClassName('save-note-btn');
  // };

  // const handelSubmit = (e) => {
  //   e.preventDefault();
  //   setIsSaved(true);
  // };

  if (!dayTrack.pinList) {
    return <div>Loading...</div>
  } else if (dayTrack.pinList.length > 0) {
    return (
      <div className={notesClassName}>
        {/* <div onClick={() => setIsNoteOpen(false)} className='close-btn'>&#215;</div> */}
        <div className='notes-top-part'>
          <div className='notes-title'>
            <div className='notes-icon'/>
            <div>Notes</div>
          </div>
          <div className='notes-pin-name'>{dayTrack.pinList[focusIndex].name}</div>
        </div>
        {/* <form onSubmit={handelSubmit}> */}
          <textarea type='textarea' className='notes-input-field'/>
          {/* <input type='submit' value='Save' className={saveBtnClassName}/> */}
          {/* <div className={savedClassName}>&#8377; Saved</div> */}
        {/* </form> */}
      </div>
    );
  }
}

export default Notes;

/* 做筆記框框
地圖上該景點圖示，跳出Notes及規劃路線按鈕，點擊Notes按鈕跳出筆記視窗
*/
