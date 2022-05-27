import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { setUser, getAvatarRef } from '../store/slice/userSlice';
import { creatUserIfNew } from '../API';
import Home from '../components/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import Trip from '../components/Trip/Trip';
import Footer from '../components/Footer/Footer';

const App = () => {
  const [userId, setUserId] = useState(null);
  // const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        dispatch(setUser({
          userId: user.uid,
          username: user.displayName,
          email: user.email,
        }));
        creatUserIfNew(user.uid, user.displayName, user.email);
      } else {
        setUserId(null);
        dispatch(setUser({
          userId: null,
          username: null,
          email: null,
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(getAvatarRef(userId));
    }
  }, [userId]);

  return !userId ? <div>Loading</div> : (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={userId ? <Dashboard /> : <Navigate to='/' />} />
          <Route path='/trip/:tripId' element={userId ? <Trip /> : <Navigate to='/' />}>
          </Route>
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