import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth, storage } from '../../firebase';
import { ref, getDownloadURL } from "firebase/storage";
import { setUser } from '../../store/slice/userSlice';
import { asyncFetchTripList } from '../../store/slice/dashboardSlice';
import TripCard from './TripCard';
import NewTrip from '../NewTrip/NewTrip';
import Footer from '../Footer/Footer';
import './Dashboard.css';
import defaultAvatar from '../../img/blank_profile_avatar.png';
import hamburgerIcon from '../../img/icons_hamburger.png';
import mapIcon from '../../img/icons_map.png';
import profileIcon from '../../img/icons_user.png';
import homeIcon from '../../img/icons_home.png';
import signOutIcon from '../../img/icons_signOut.png';

const Dashboard = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const dashboardStates = useSelector(state => state.dashboard);
  const { tripList, isProcessing } = dashboardStates;
  const [openedTripCardOptionModal, setOpenedTripCardOptionModal] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const avatarFetching = user.avatar ? 'dashboard-avatar' : 'dashboard-avatar dashboard-avatar-loading-background';
  const processingLoading = isProcessing ? 'creating-new-trip' : 'display-none';
  const hamburgerClassName = isHamburgerOpen ? 'hamburger-menu' : 'display-none';

  useEffect(() => {
    dispatch(asyncFetchTripList(user.userId));
  }, []);

  useEffect(() => {
    if (user.avatar) {
      if (user.avatar == 'default') {
        setAvatar(defaultAvatar);
      } else {
        getDownloadURL(ref(storage, user.avatar))
          .then(url => {
            setAvatar(url);
          })
          .catch(err => {
            console.log('Something goes wrong', err);
          });
      }
    }
  }, [user.avatar]);

  const handleSignOut = () => {
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('email');
    signOut(auth);
    dispatch(setUser({
      userId: null,
      username: null,
      email: null
    }));
  }

  return (
    <div>
      <div className='dashboard-container'>
        <div className={processingLoading}></div>
        <div className='dashboard-sidebar'>
          <div className={avatarFetching}>
            <div className='dashboard-avatar-img' style={{backgroundImage: `url(${avatar})`}}/>
          </div>
          <div className='dashboard-username'>{user.username}</div>
          <hr/>
          <div className='dashboard-menu'>
            <NavLink to='/dashboard'>
              <div className='dashboard-menu-item'>My Trips</div>
            </NavLink>
            <NavLink to='/profile'>
              <div className='dashboard-menu-item'>Profile</div>
            </NavLink>
            <NavLink to='/home'>
              <div className='dashboard-menu-item'>Home</div>
            </NavLink>
          </div>
          <button className='dashboard-sign-out-btn' onClick={handleSignOut}>Sign Out</button>
          <img src={hamburgerIcon} className='hamburger' onClick={() => setIsHamburgerOpen(current => !current)}/>
          <div className={hamburgerClassName}>
            <div className='nav-btn'>
              <img src={mapIcon}/>
              <div onClick={() => setIsHamburgerOpen(false)}>My Trips</div>
            </div>
            <NavLink to='/profile'>
              <div className='nav-btn'>
                <img src={profileIcon}/>
                <div>Profile</div>
              </div>
            </NavLink>
            <NavLink to='/home'>
              <div className='nav-btn'>
                <img src={homeIcon}/>
                <div>Home</div>
              </div>
            </NavLink>
            <div className='nav-btn' onClick={handleSignOut}>
              <img src={signOutIcon}/>
              <div>Sign Out</div>
            </div>
          </div>
        </div>
        <div className='new-trip-btn' onClick={() => setIsModalShown(true)}>+</div>
        <div className='collections'>
          <div
            key={tripList.length}
            className='trip-card new-trip'
            onClick={() => setIsModalShown(true)}
          >
            <div className='plus-container'>
              <div className='plus'>+</div>
            </div>
          </div>
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