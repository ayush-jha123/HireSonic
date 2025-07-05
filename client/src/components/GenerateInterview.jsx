import React, { useState, useEffect } from 'react'
import Agent from './Agent'

const GenerateInterview = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Get user data from localStorage (authentication is already checked at route level)
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    setUserName(storedUserName);
    setUserId(storedUserId);
  }, []);

  return (
    <div>
        <Agent type="generate" username={userName} userId={userId}/>
    </div>
  )
}

export default GenerateInterview