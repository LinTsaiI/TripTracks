import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { userIdentity, setUser } from '../store/slice/userSlice';
import { creatUserIfNew } from '../API';
import Home from '../components/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import Trip from '../components/Trip/Trip';
import MapContent from '../components/MapContent/MapContent';

const App = () => {
  const userId = useSelector(userIdentity);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(setUser({
          userId: user.uid,
          username: user.displayName,
          email: user.email
        }));
        creatUserIfNew(user.uid, user.displayName, user.email);
      } else {
        dispatch(setUser({
          userId: null,
          username: null,
          email: null
        }));
      }
    });
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={userId ? <Navigate to='/dashboard' /> : <Home />} />
          <Route path='/dashboard' element={userId ? <Dashboard /> : <Navigate to='/' />} />
          <Route path='/trip/*' element={userId ? <Trip /> : <Navigate to='/' />}>
            <Route path=':tripId' element={<Trip />} />
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