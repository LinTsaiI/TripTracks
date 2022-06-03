import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { setUser, changeAvatar, changeName } from '../../store/slice/userSlice';
import defaultAvatar from '../../img/blank_profile_avatar.png';
import uploadImgIcon from '../../img/icons_camera.png';
import editIcon from '../../img/icons_edit.png';
import hamburgerIcon from '../../img/icons_hamburger.png';
import mapIcon from '../../img/icons_map.png';
import profileIcon from '../../img/icons_user.png';
import homeIcon from '../../img/icons_home.png';
import signOutIcon from '../../img/icons_signOut.png';
import './Profile.css';

const Profile = () => {
  const user = useSelector(state => state.user);
  const tripList = useSelector(state => state.dashboard.tripList);
  const dispatch = useDispatch();
  const mapRegion = useRef();
  const [tripMarkerList, setTripMarkerList] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [cover, setCover] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDataUpdating, setIsDataUpdating] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const loading = isDataUpdating ? 'user-data-loading' : 'display-none';
  const hamburgerClassName = isHamburgerOpen ? 'hamburger-menu' : 'display-none';

  const mapLoader = new Loader({
    apiKey: process.env.REACT_GOOGLE_MAP_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    mapLoader.load().then((google) => {
      const map = new google.maps.Map(mapRegion.current, {
        mapId: '6fe2140f54e6c7b3',
        mapTypeControl: false,
        center: { lat: 20, lng: 0 },
        zoom: 2
      });
      tripList.forEach(trip => {
        const markerOptions = {
          map: map,
          position: trip.destinationLatLng,
        }
        new google.maps.Marker(markerOptions);
      });
    });
  }, []);

  useEffect(() => {
    fetch(`https://api.unsplash.com/photos/random?query='city'&count=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`, {method: 'GET'})
      .then(response => response.json()) 
      .then(result => {
        setCover(result[0].urls.regular);
      })
      .catch(e => {
        console.log('err', e);
      });
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

  useEffect(() => {
    if (name) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name]);

  useEffect(() => {
    if (!isProfileModalOpen) {
      setName('');
      setDisabled(true);
    }
  }, [isProfileModalOpen]);

  const uploadAvatar = (e) => {
    setIsDataUpdating(true);
    const file = e.target.files[0];
    const avatarRef = ref(storage, `avatar/${user.userId}/${file.name}`);
    uploadBytes(avatarRef, file)
      .then(snapshot => {
        updateDoc(doc(db, 'user', user.userId), {
          avatar: snapshot.ref.fullPath
        });
        dispatch(changeAvatar(snapshot.ref.fullPath));
        setIsDataUpdating(false);
        setDisabled(false);
      })
      .catch(err => console.log('Something goes wrong', err));
    return false;
  }

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

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (name) {
      await updateDoc(doc(db, 'user', user.userId), {
        name: name
      });
      dispatch(changeName(name));
    } else {
      return false;
    }
  };

  return (
    <div>
      <nav className='profile-nav'>
        <div><NavLink to='/dashboard'>My Trips</NavLink></div>
        <div><NavLink to='/profile'>Profile</NavLink></div>
        <div><NavLink to='/home'>Home</NavLink></div>
        <button className='sign-out-btn' onClick={handleSignOut}>Sign Out</button>
      </nav>
      <img src={hamburgerIcon} className='profile-hamburger' onClick={() => setIsHamburgerOpen(current => !current)}/>
      <div className={hamburgerClassName}>
        <NavLink to='/dashboard'>
          <div className='nav-btn'>
            <img src={mapIcon}/>
            <div>My Trips</div>
          </div>
        </NavLink>
        <div className='nav-btn'>
          <img src={profileIcon}/>
          <div onClick={() => setIsHamburgerOpen(false)}>Profile</div>
        </div>
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
      <div>
        <div className='profile-background' style={{backgroundImage: `url(${cover})`}}/>
        <div className='profile-user'>
          <div className='profile-avatar'>
            <div style={{backgroundImage: `url(${avatar})`}}/>
          </div>
          <div className='profile-username'>{user.username}</div>
          <button onClick={() => setIsProfileModalOpen(true)}><img src={editIcon}/>Edit</button>
        </div>
      <div className='profile-map'>
        <div ref={mapRegion}/>
      </div>
      </div>
      {
        isProfileModalOpen ? (
          <div className='profile-modal-background'>
            <div className='profile-modal'>
              <div className='profile-modal-title'>Edit Your Profile</div>
              <div onClick={() => setIsProfileModalOpen(false)} className='close-btn'>&#215;</div>
              <form onSubmit={handelSubmit}>
                <div className='profile-avatar'>
                  <div style={{backgroundImage: `url(${avatar})`}}/>
                  <label htmlFor='avatar-img'>
                    <img src={uploadImgIcon}/>
                  </label>
                  <input type='file' id='avatar-img' accept='image/*' onChange={uploadAvatar}/>
                </div>
                <div className='profile-modal-input'>
                  <label htmlFor='username'>Username</label>
                  <input type='text' id='username' placeholder='New username' value={name} onChange={e => {
                    if (e.target.value) {
                      setName(e.target.value);
                    } else {
                      setName('');
                    }}
                  }/>
                </div>
                <input type='submit' value='Save' disabled={disabled}/>
              </form>
            </div>
          </div>
        ) : <div/>
      }
    </div>
  )
}

export default Profile;;