import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sign from '../components/Sign/Sign';
import Dashboard from '../components/Dashboard/Dashboard';
import Trip from '../components/Trip/Trip';
import Map from '../components/Map/Map';

const App = () => {
  const userStatus = useSelector(state => state.user.isSignIn);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={userStatus ? <Navigate to='/dashboard' /> : <Navigate to='/sign' /> } />
          <Route path='/sign' element={<Sign />} />
          <Route path='/dashboard' element={userStatus ? <Dashboard /> : <Navigate to='/sign' />} />
          <Route path='/trip/*' element={<Trip /> }>
            <Route index element={<Map />} />
            <Route path=':place' element={<Map />}>
              <Route path=':day' element={<Map />}/>
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