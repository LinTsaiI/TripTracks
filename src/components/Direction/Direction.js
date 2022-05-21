import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { TripContext } from '../Trip/Trip';
import './Direction.css';

const Direction = () => {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const trackIndex = day ? day-1 : 0;
  const dayTrack = useSelector(state => state.trip);
  const value = useContext(TripContext);
  const { isDirectionOpen, setIsDirectionOpen, currentFocusDirection, setCurrentFocusDirection } = value;
  const startIndex = currentFocusDirection ? Number(currentFocusDirection) : 0;
  const endIndex = startIndex + 1;
  const directionClassName  = isDirectionOpen ? 'direction-container' : 'display-none';

  useEffect(() => {
    setIsDirectionOpen(false);
    setCurrentFocusDirection(null);
  }, [trackIndex]);

  if (!dayTrack.pinList) {
    return <div>Loading...</div>
  } else if (dayTrack.pinList.length > 1) {
    return (
      <div className={directionClassName}>
        <div onClick={() => setIsDirectionOpen(false)} className='close-btn'>&#215;</div>
        <div className='direction-top-part'>
          <div className='direction-title-block'>
            <div className='direction-img'/>
            <div className='direction-title'>Direction</div>
          </div>
          <div className='direction-pin-name'>{dayTrack.pinList[startIndex].name}</div>
          <div className='direction-arrow'>&#8595;</div>
          <div className='direction-pin-name'>{dayTrack.pinList[endIndex].name}</div>
        </div>
        <div className='direction-choice'>Here embed Google Direction results:{dayTrack.directions}</div>
      </div>
    );
  }
}

export default Direction;