import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Agent from "./Agent";

const Interview = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Get user data from localStorage (authentication is already checked at route level)
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    setUserName(storedUserName);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`http://localhost:5000/interview/get/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        setInterview(data.interview);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterview();
  }, [id]);

  return (
    <div>
      {/* <h1>Take Interview</h1> */}
      <Agent questions={interview?.questions} type="take" username={userName} userId={userId} interviewId={id}/>
    </div>
  );
};

export default Interview;
