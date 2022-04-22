import React from 'react';

const Marker = ({position, map}) => {
  let marker = new window.google.maps.Marker({
    position: position,
    map: map
  })
  return <div>{marker}</div>
}

export default Marker;