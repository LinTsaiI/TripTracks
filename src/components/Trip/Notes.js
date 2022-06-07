import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import './Notes.css';
import savingLoadingImg from '../../img/icons_loading_circle.gif';

const getNotes = async (targetNotes) => {
  try {
    const pinSnap = await getDoc(doc(db, 'trips', targetNotes.tripId, 'tracks', targetNotes.trackId, 'pins', targetNotes.pinId));
    if (pinSnap.exists()) {
      return pinSnap.data().notes;
    }
  } catch (err) {
    console.log('Error getting notes', err);
  }
};

const saveNotes = async (notesInfo) => {
  try {
    await updateDoc(doc(db, 'trips', notesInfo.tripId, 'tracks', notesInfo.trackId, 'pins', notesInfo.pinId), {
      notes: notesInfo.notes
    });
  } catch (err) {
    console.log('Error updating notes', err);
  }
};

const Notes = ({ isNoteOpen, setIsNoteOpen, currentFocusNote, setCurrentFocusNote }) => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const [notes, setNotes] = useState('');
  const [saveBtnClassName, setSaveBtnClassName] = useState('display-none');
  const [savedClassName, setSavedClassName] = useState('display-none');
  const [savingLoadingClassName, setSavingLoadingClassName] = useState('display-none');
  const [isSaved, setIsSaved] = useState(false);
  const dayTrack = useSelector(state => state.trip);
  const focusIndex = currentFocusNote ? currentFocusNote : 0;
  const notesDisplay  = isNoteOpen ? 'notes-container' : 'display-none';

  useEffect(() => {
    setIsNoteOpen(false);
    setCurrentFocusNote(null);
  }, [trackIndex]);

  useEffect(() => {
    if (focusIndex && isNoteOpen) {
      getNotes({
        tripId: dayTrack.tripId,
        trackId: dayTrack.trackId,
        pinId: dayTrack.pinIds[focusIndex]
      })
        .then(notes => {
          setNotes(notes);
        });
    }
  }, [focusIndex]);

  useEffect(() => {
    if (!isSaved) {
      setNotes('');
    }
    setSavedClassName('display-none');
    setSaveBtnClassName('display-none');
    setSavingLoadingClassName('display-none');
  }, [currentFocusNote, isNoteOpen]);

  const handelInputChange = (e) => {
    setSavedClassName('display-none');
    setNotes(e.target.value);
    setSaveBtnClassName('save-note-btn');
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setSaveBtnClassName('display-none');
    setSavingLoadingClassName('saving');
    saveNotes({
      tripId: dayTrack.tripId,
      trackId: dayTrack.trackId,
      pinId: dayTrack.pinIds[focusIndex],
      notes: notes
    })
      .then(() => {
        setIsSaved(true);
        setSavingLoadingClassName('display-none')
        setSavedClassName('saved');
      })
  };

  if (!dayTrack.pinList) {
    return <div>Loading...</div>
  } else if (dayTrack.pinList.length > 0) {
    return (
      <div className={notesDisplay}>
        <div onClick={() => setIsNoteOpen(false)} className='close-btn'>&#215;</div>
        <div className='notes-top-part'>
          <div className='notes-title-block'>
            <div className='notes-icon'/>
            <div className='notes-title'>Notes</div>
          </div>
          <div className='notes-pin-name'>{dayTrack.pinList[focusIndex].name}</div>
        </div>
        <form onSubmit={handelSubmit} className='notes-field-block'>
          <textarea type='textarea' className='notes-input-field' placeholder='Take some notes!' value={notes} onChange={handelInputChange}>
          </textarea>
          <div className='note-save-bock'>
            <input type='submit' value='Save' className={saveBtnClassName}/>
            <img src={savingLoadingImg} className={savingLoadingClassName}/>
            <div className={savedClassName}>&#10003; Saved</div>
          </div>
        </form>
      </div>
    );
  }
}

export default Notes;