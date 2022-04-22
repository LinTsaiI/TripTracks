import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onInputChange }) => {
  return(
    <div className='search-input-block'>
      <input type='text' className='search-input' onChange={(e) => onInputChange(e.target)}/>
      <input type='button' className='search-button'/>
    </div>
  )
}

export default SearchBar;