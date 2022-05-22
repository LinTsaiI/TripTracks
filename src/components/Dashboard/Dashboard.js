import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import { asyncFetchTripList } from '../../store/slice/dashboardSlice';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const dashboardStates = useSelector(state => state.dashboard);
  const { tripList, isProcessing } = dashboardStates;
  const [openedTripCardOptionModal, setOpenedTripCardOptionModal] = useState(null);
  const creatingLoadingClassName = isProcessing ? 'creating-new-trip' : 'display-none';

  useEffect(() => {
    dispatch(asyncFetchTripList(user.userId));
  }, []);

  if (tripList) {
    return (
      <div>
        <div className='dashboard-container'>
          <div className={creatingLoadingClassName}></div>
          <div className='dashboard-menu'>
            <div className='dashboard-avatar'>{user.username[0]}</div>
            <div className='menu-item'>My trips</div>
            <button className='sign-out-btn' onClick={() => signOut(auth)}>Sign Out</button>
          </div>
          <div className='collections'>
            {
              tripList.map((trip, index) => {
                return <TripCard
                  key={index}
                  trip={trip}
                  index={index}
                  openedTripCardOptionModal={openedTripCardOptionModal}
                  setOpenedTripCardOptionModal={setOpenedTripCardOptionModal}
                />
              })
            }
            <div
              key={tripList.length}
              className='trip-card'
              onClick={() => setIsModalShown(true)}
            >
              <div className='new-trip'>
                <div className='plus-icon'>+</div>
              </div>
            </div>
          </div>
          {
            isModalShown ? <NewTrip openModal={setIsModalShown} /> : <div/>
          }
        </div>
        <Footer />
      </div>
    )
  }
}

export default Dashboard;