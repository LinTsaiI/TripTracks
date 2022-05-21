import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { userIdentity } from '../../store/slice/userSlice';
import { getTripList } from '../../API';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const userId = useSelector(userIdentity);
  const userName = useSelector(state => state.user.username);
  const isNewTripCreating = useSelector(state => state.newTrip.isCreating)
  const [tripList, setTripList] = useState([]);
  const [isTripListLoading, setIsTripListLoading] = useState(true);
  const creatingLoadingClassName = isNewTripCreating ? 'creating-new-trip' : 'display-none';

  useEffect(() => {
    getTripList(userId)
      .then(result => {
        setTripList(result);
      })
      .then(() => {
        setIsTripListLoading(false);
      });
  }, []);

  return !tripList ? <div>Loading...</div> : (
    <div>
      <div className='dashboard-container'>
        <div className={creatingLoadingClassName}></div>
        <div className='dashboard-menu'>
          <div className='dashboard-avatar'>{userName[0]}</div>
          <div className='menu-item'>My trips</div>
          <button className='sign-out-btn' onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <div className='collections'>
          <TripCard
            tripList={tripList}
            openModal={setIsModalShown}
            isLoading={isTripListLoading}
          />
        </div>
        {
          isModalShown ? <NewTrip openModal={setIsModalShown} /> : <div/>
        }
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard;