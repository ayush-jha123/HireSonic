import React from "react";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Agent from "./components/Agent";
import Interview from "./components/Interview";
import GenerateInterview from "./components/GenerateInterview";
import InterviewForm from "./components/InterviewForm";
import Feedback from "./components/Feedback";
import SignUp from "./components/SignUp";

// Authentication guard component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (!userId || !userName) {
    return <Navigate to="/signup" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <div className="w-full h-full">
      {/* <Navbar/> */}
      <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/generate" element={
          <ProtectedRoute>
            <GenerateInterview />
          </ProtectedRoute>
        } />
        <Route path="/create-interview" element={
          <ProtectedRoute>
            <InterviewForm />
          </ProtectedRoute>
        } />
        <Route path="/interview/:id" element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        } />
        <Route path="/feedback/:feedbackId" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
