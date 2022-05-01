import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { setUserId } from '../store/slice/userSlice';
import { creatUserIfNew } from '../API';
import Home from '../components/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import Trip from '../components/Trip/Trip';
import Map from '../components/Map/Map';

const App = () => {
  const userId = useSelector(state => state.user.userId);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setUserId({
          userId: user.uid
        }));
        creatUserIfNew(user.displayName, user.email, user.uid);
      }
    })
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={userId ? <Navigate to='/dashboard' /> : <Home />} />
          <Route path='/dashboard' element={userId ? <Dashboard /> : <Navigate to='/' />} />
          <Route path='/trip/*' element={<Trip /> }>
            <Route path=':tripId' element={<Map />}>
            </Route>
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
  )
}

export default App;