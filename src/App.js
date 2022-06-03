import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { setUser, getAvatarRef } from './store/slice/userSlice';
import { creatUserIfNew } from './API';
import WelcomeAnimation from './components/WelcomeAnimation/WelcomeAnimation';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Trip from './components/Trip/Trip';
import Profile from './components/Profile/Profile';
import './App.css';

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
        dispatch(setUser({
          userId: user.uid,
          username: user.displayName,
          email: user.email,
        }));
        creatUserIfNew(user.uid, user.displayName, user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch(getAvatarRef(userId));
    }
  }, [userId]);

  // let output=null;
  // if(userId){
  //   output=<></>
  // }
  return isLoading ? <WelcomeAnimation /> : (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={userId ? <Dashboard /> : <Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={userId ? <Dashboard /> : <Navigate to='/' />} />
          <Route path='/trip/:tripId' element={userId ? <Trip /> : <Navigate to='/' />}>
          </Route>
          <Route path='/profile' element={userId ? <Profile /> : <Navigate to='/' />} />
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

  // useEffect(() => {
  //   onAuthStateChanged(auth, user => {
  //     if (user) {
  //       try {
  //         getDoc(doc(db, 'user', user.uid))
  //           .then(userSnap => {
  //             if (userSnap.exists()) {
  //               dispatch(setUser({
  //                 userId: user.uid,
  //                 username: userSnap.data().name,
  //                 email: user.email
  //               }));
  //             } else {
  //               dispatch(setUser({
  //                 userId: user.uid,
  //                 username: user.displayName,
  //                 email: user.email,
  //               }));
  //               creatUserIfNew(user.uid, user.displayName, user.email);
  //             }
  //           })
  //       } catch (err) {
  //         console.log('Error getting user', err);
  //       }
  //     }
  //   });
  // }, []);
