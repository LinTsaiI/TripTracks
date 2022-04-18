import React from 'react';
import { NavLink } from 'react-router-dom';

const Days = ({ tripName, duration }) => {
  let days = [];
  for(let i = 0; i < duration; i++) {
    days.push(
      <NavLink
        to={`/trip/${tripName}/${i+1}`}
        style={({ isActive }) => {
          return {
            display: 'inline-flex',
            padding: '10px',
            color: isActive ? 'red' : 'black'
          }
        }}
        key={i+1}
      >
        <div>Day{i+1}</div>
      </NavLink>
    );
  }
  return days;
}

export default Days;