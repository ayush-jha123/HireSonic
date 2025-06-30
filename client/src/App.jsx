import React from "react";
import Home from "./components/Home";
// import ShareRecipe from "./components/recipe/shareRecipe";
// import Recipes from "./components/recipe/recipes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
// import SignUp from "./components/SignUp";
// import RecipeDetails from "./components/recipe/RecipeDetails";
// import UpdateRecipe from "./components/recipe/updateRecipe";
// import Profile from "./components/Profile";
// import About from "./components/About";

const App = () => {
  return (
    <div className="w-full h-full ">
      <Navbar/>
      <BrowserRouter>
      <Routes>
        <Route path="*" element={<Home />} />
        {/* <Route path="/signup" element={<SignUp/>}/> */}
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
