import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { userIdentity, setUser } from '../../store/slice/userSlice';
import { getTripList } from '../../API';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const userId = useSelector(userIdentity);
  const [tripList, setTripList] = useState([]);
  const [isTripListLoading, setIsTripListLoading] = useState(true);

  useEffect(() => {
    getTripList(userId)
      .then(result => {
        setTripList(result);
      })
      .then(() => {
        setIsTripListLoading(false);
      });
  }, []);

  // const userSignOut = () => {
  //   signOut(auth).then(() => {
  //     dispatch(setUser({
  //       userId: null
  //     }));
  //   }).catch(error => console.log(error))

  // }

  return !tripList ? <div>Loading...</div> : (
    <div>
      <div className='dashboard-container'>
        <div className='dashboard-menu'>
          <div className='dashboard-avatar'>A</div>
          <div className='menu-item'>My trips</div>
          <button className='sign-out-btn' onClick={() => signOut(auth)}>Sign Out</button>
        </div>
        <div className='collections'>
          <TripCard tripList={tripList} openModal={setIsModalShown} isLoading={isTripListLoading}/>
        </div>
      </div>
      {
        isModalShown ? <NewTrip openModal={setIsModalShown} /> : <div/>
      }
      <Footer />
    </div>
  )
}

export default Dashboard;