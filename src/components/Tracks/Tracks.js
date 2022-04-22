import React, { useEffect } from 'react';
import SearchBar from './searchBar';
import Pin from './Pin';

import './Tracks.css';

const Tracks = () => {
  return (
    <div className='tracks-container'>
      <SearchBar />
      <Pin />
    </div>
  )
}

export default Tracks;

// Map上左手邊視窗，包含搜尋框，加入行程顯示