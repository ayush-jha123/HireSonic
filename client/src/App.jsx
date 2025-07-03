import React from "react";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Agent from "./components/Agent";
import Interview from "./components/Interview";
import GenerateInterview from "./components/GenerateInterview";


const App = () => {
  return (
    <div className="w-full h-full">
      {/* <Navbar/> */}
      <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/generate" element={<GenerateInterview />} />
        <Route path="/interview/:id" element={<Interview />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
