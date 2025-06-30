import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4">
      <h2 className="text-white text-2xl font-semibold mb-10">Interview Generation</h2>

      <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-6">
          {/* AI Interviewer Card */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#171532] to-[#08090D] w-full sm:w-1/2 h-64 rounded-xl border-2 border-gray-700">
            <div className="bg-white/10 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium">AI Interviewer</p>
          </div>

          {/* You Card */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#171532] to-[#08090D] w-full sm:w-1/2 h-64 rounded-xl border-2 border-gray-700">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="You"
              className="w-20 h-20 rounded-full object-cover border-2 border-white"
            />
            <p className="mt-4 text-lg font-medium">You</p>
          </div>
        </div>

        {/* Message Box */}
        <div className="bg-[#1A1C20] border border-gray-700 w-full text-center py-4 px-6 rounded-lg">
          My name is John Doe, nice to meet you!
        </div>

        {/* Call Button */}
        <button className="bg-green-500 hover:bg-green-600 transition px-6 py-2 rounded-full text-white font-semibold">
          Call
        </button>
      </div>
    </div>
  );
};

export default Home;
