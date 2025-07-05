import React from 'react'
import googleIcon from '../../public/google1.jpg';
import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../Firebase';

const OAuth = () => {
  const navigate = useNavigate();
  
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      // Make API call to /user/google
      const response = await fetch('https://hiresonic.onrender.com/user/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          profilePhoto: result.user.photoURL
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }
      
      const data = await response.json();
      console.log('Google authentication successful:', data);
      
      // Save userId to localStorage
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      
      alert('You are signed in successfully with Google!');
      navigate('/');
      
    } catch (error) {
      console.error("Could not login with google:", error);
      alert(error.message || 'Google authentication failed. Please try again.');
    }
  }
  
  return (
    <button type='button' onClick={handleGoogleClick} className='w-full justify-center flex flex-row bg-slate-100 p-2.5 rounded-lg hover:bg-slate-300 hover:text-white gap-1 ring-1'>
        <img src={googleIcon} alt="" className='w-6 rounded-full'/>
        <p className='text-md font-semibold font-mono hover:text-white'>Continue with google</p>
    </button>
  )
}

export default OAuth