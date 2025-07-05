import React, { useState } from "react";
import auth from "../../public/auth.avif";
import OAuth from "./OAuth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [toogle, setToggle] = useState(true);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (toogle) {
        // Sign Up API call
        const response = await fetch('http://localhost:5000/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
        
        const data = await response.json();
        console.log('Signup successful:', data);
        
        // Save userId to localStorage
        localStorage.setItem('userId', data._id);
        localStorage.setItem('userName', data.name);
        
        alert('You are signed up successfully!');
        navigate('/');
        
      } else {
        // Sign In API call
        const response = await fetch('http://localhost:5000/user/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signin failed');
        }
        
        const data = await response.json();
        console.log('Signin successful:', data);
        
        // Save userId to localStorage
        localStorage.setItem('userId', data._id);
        localStorage.setItem('userName', data.name);
        
        alert('You are signed in successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error.message || 'Some error occurred! Try again');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen min-w-screen flex flex-row ">
      <div className="w-1/2 flex justify-center items-center max-lg:hidden">
        <img src={auth} alt="" className="w-full h-full p-12" />
      </div>
      <div className="w-1/2 flex justify-center items-center bg-slate-50 max-lg:w-full">
        <div className="bg-white w-1/2 flex justify-center flex-col p-4 space-y-3 rounded-lg ring-1 max-md:w-3/4 ">
          <h1 className="text-center font-semibold text-lg ">
            {toogle ? "SignUp" : "SignIn"}
          </h1>
          <div className="space-y-2">
            <OAuth />
            <div className="flex items-center w-full">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500 font-semibold text-lg">
                or
              </span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <form className="flex flex-col space-y-3">
              {toogle && (
                <>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your Name"
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 "
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xxx@gmail.com"
                onChange={handleChange}
                required
              />

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*********"
                onChange={handleChange}
                required
              />
              {toogle && (
                <>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-900 "
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="***********"
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              {toogle ? (
                <p className="font-serif">
                  Already have Account?
                  <button
                    type="button"
                    className="font-semibold cursor-pointer ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setToggle((prev) => !prev)}
                  >
                    SignIn
                  </button>
                </p>
              ) : (
                <p className="font-serif">
                  Don't have Account?
                  <button
                    type="button"
                    className="font-semibold cursor-pointer ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => setToggle((prev) => !prev)}
                  >
                    SignUp
                  </button>
                </p>
              )}
              <button 
                type="submit" 
                className="black_btn" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
