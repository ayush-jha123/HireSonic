import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";

const InterviewCards = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage,
}) => {
  // console.log("InterviewCard Props:", {interviewId, userId, role, type, techstack, createdAt})
  return (
    <div className="bg-slate-100 shadow-md rounded-2xl p-4 border-1 border-slate-300 relative w-full flex flex-col  justify-between hover:shadow-lg transition-shadow duration-300 h-[22rem] shadow-gray-500 ">
      <p className="text-gray-600 absolute right-0 top-0 bg-slate-200 p-2 text-[1.1rem] font-mono rounded-2xl">
        {type}
      </p>
      <div className="w-[45%] h-[10rem] flex justify-center items-center mb-4">
        <img
          src={coverImage}
          alt="logo"
          className="w-[9rem] h-[7rem] rounded-full"
        />
      </div>
      <div className="flex flex-col justify-between items-start w-full mt-0 h-[55%] gap-1">
        <h1 className="text-xl font-bold text-gray-800 font-mono text-[2.3rem] uppercase">
          {role}
        </h1>
        {/* <p className="text-gray-600 font-mono">Tech Stack: {techstack.join(", ")}</p> */}
        <div className="flex items-center space-x-2 text-[1.6rem]">
          <FaCalendarDays />
          <p className="text-gray-500 text-[1.2rem] font-mono">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="w-full ">
          <p className="text-gray-600 font-mono text-[0.8rem]">Please practice your interviews before the interview. This will help you to succeed.</p>
        </div>
        <Link
          to={`/interview/${interviewId}`}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start
        </Link>
      </div>
    </div>
  );
};

export default InterviewCards;
