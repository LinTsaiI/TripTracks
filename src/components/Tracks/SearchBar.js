import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onInputChange, onSearchClick }) => {
  return(
    <div className='search-input-block'>
      <input type='text' className='search-input' onChange={(e) => onInputChange(e.target)}/>
      <input type='button' className='search-button' onClick={() => onSearchClick()}/>
    </div>
  )
}

export default SearchBar;