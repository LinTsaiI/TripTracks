import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { setUser, getAvatarRef } from './store/slice/userSlice';
import WelcomeAnimation from './components/WelcomeAnimation/WelcomeAnimation';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Trip from './components/Trip/Trip';
import Profile from './components/Profile/Profile';
import './App.css';

const creatNewUser = async (userId, username, email) => {
  try {
    await setDoc(doc(db, 'user', userId), {
      name: username,
      email: email,
      tripId: [],
      FirstEntryTime: serverTimestamp(),
      avatar: 'default'
    });
    console.log('create new user successfully');
  } catch (err) {
    console.error('Error adding document: ', err);
  }
};

const App = () => {
  const userId = useSelector(state => state.user.userId);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const userId = window.localStorage.getItem('userId');
    const username = window.localStorage.getItem('username');
    const email = window.localStorage.getItem('email');
    if (userId && username && email) {
      dispatch(setUser({
        userId: userId,
        username: username,
        email: email,
      }));
    } 
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        getDoc(doc(db, 'user', user.uid))
          .then(userSnap => {
            if (userSnap.exists()) {
              dispatch(setUser({
                userId: user.uid,
                username: userSnap.data().name,
                email: user.email,
              }));
            } else {
              creatNewUser(user.uid, user.displayName, user.email);
              dispatch(setUser({
                userId: user.uid,
                username: user.displayName,
                email: user.email,
              }));
            }
          })
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(getAvatarRef(userId));
    }
  }, [userId]);

  let output;
  if (userId) {
    output = <>
      <Route path='/' element={<Dashboard />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/trip/:tripId' element={<Trip />} />
      <Route path='/profile' element={<Profile />} />
    </>
  } else {
    output = <>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<Navigate to='/' />} />
      <Route path='/trip/:tripId' element={<Navigate to='/' />} />
      <Route path='/profile' element={<Navigate to='/' />} />
    </>
  }

  return isLoading ? <WelcomeAnimation /> : (
    <div>
      <BrowserRouter>
        <Routes>
          {output}
          <Route path='/home' element={<Home />} />
          <Route
              path='*'
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;