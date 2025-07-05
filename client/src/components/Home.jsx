import React, { useEffect, useState } from "react";
import Agent from "./Agent";
import rocket from "../../public/rocket1.png";
import lady from "../../public/logo1.avif";
import { Link, useNavigate } from "react-router-dom";
import InterviewCard from "./InterviewCards";
{
  /* <Agent username={username} userid={userid} type={type}/> */
}

const Home = () => {
  const [username, setUsername] = useState("Ayush Jha");
  const [userid, setUserid] = useState("686217a238d3d752e9751c88");
  const [interviews, setInterviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (userId && userName) {
      setIsLoggedIn(true);
      setUsername(userName);
      setUserid(userId);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://hiresonic.onrender.com/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Update state
        setIsLoggedIn(false);
        setUsername("Ayush Jha");
        setUserid("686217a238d3d752e9751c88");
        setInterviews([]); // Clear interviews when logging out
        
        alert('Logged out successfully!');
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        // Only fetch interviews if user is logged in
        if (!isLoggedIn) {
          setInterviews([]);
          return;
        }

        const response = await fetch(`https://hiresonic.onrender.com/interview/user/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        setInterviews(data.interviews);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setInterviews([]);
      }
    };
    
    fetchInterviews();
  }, [isLoggedIn, userid]); // Add dependencies to re-fetch when login status or userid changes
  console.log(interviews);
  
  // Remove any accidental usage of <link> (lowercase) instead of <Link> (uppercase from react-router-dom)
  // Make sure you are not using <link> (HTML tag) with children anywhere in your code.
  return (
    <div className="w-full  h-full ">
      <div className="bg-white m-[5rem] ml-[8rem] border-2 border-orange-500 rounded-2xl p-2 max-h-full shadow-lg shadow-orange-800">
        <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-full h-[8rem] rounded-lg  flex justify-between px-16 items-center">
          <div className="flex flex-row space-x-3 items-center p-4">
            <img src={rocket} alt="logo" className="w-[5rem]" />
            <h1 className="text-[3rem] font-bold font-serif text-orange-700">
              HireSonic
            </h1>
          </div>
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white p-4 text-center items-center flex justify-center rounded-lg w-[6rem] h-[2.5rem] hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link to="/signup" className="bg-orange-500 text-white p-4 text-center items-center flex justify-center rounded-lg w-[6rem] h-[2.5rem]">
              LogIn
            </Link>
          )}
        </div>
        <div className="w-full box-content flex flex-row items-center  space-4 mt-10">
          <div className="flex justify-center w-1/2 h-full">
            <img
              src={lady}
              alt="Banner"
              className="w-[70%] rounded-lg "
            />
          </div>
          <div className="flex flex-col items-center justify-center mt-5 w-1/2 h-full space-y-4 pr-8">
            <p className="text-[3.5rem] font-bold text-orange-700 font-serif">
              Welcome to HireSonic! 🚀 
            </p>
            <p className="text-[1.8rem] font-semibold text-gray-700 font-mono">
              Ace your next interview with AI-powered
              coaching that feels just like the real deal. <br />💡 Practice with
              hyper-realistic simulations <br /> 🎯 Get instant feedback on your
              answers <br /> 📊 Improve faster with personalized tips <br /> Ready to
              outperform the competition? Let’s get started!</p>

            <Link to="/generate" className="bg-orange-500 text-white p-4 items-center flex justify-center text-[1.2rem] cursor-pointer font-mono rounded-lg w-[10rem] h-[3rem] ">
              Get Started
            </Link>
          </div>
        </div>

        {isLoggedIn && (
          <div className=" flex flex-col w-[85%]  space-4 mt-10 ">
            <p className="text-[2rem] font-bold text-gray-800 w-full justify-center font-mono">Your Interviews</p>
            <div className="items-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {interviews.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-gray-600 mb-4">No interviews scheduled yet.</p>
                  <p className="text-md text-gray-500 mb-6">Ready to ace your next interview? Schedule one now!</p>
                  <Link to="/create-interview" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                    Schedule Interview
                  </Link>
                </div>
              ) : (
                interviews.map((interview) => (
                  <InterviewCard
                    key={interview?._id}
                    interviewId={interview?._id}
                    userId={interview?.userId}
                    role={interview?.role}
                    type={interview?.type}
                    techstack={interview?.techstack}
                    createdAt={interview?.createdAt}
                    coverImage={interview?.coverImage} 
                  />
                ))
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;
