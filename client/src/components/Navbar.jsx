import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5"; // Fixed import
import { IoMdClose } from "react-icons/io"; // Fixed import

const Navbar = ({ textColor = "text-black" }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="my-5 w-full flex relative p-5 rounded-lg shadow-lg bg-white items-center justify-between h-16">
      <div className="text-xl font-bold">YourLogo</div>

      <div className="xl:hidden">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <IoMdClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-b-lg xl:hidden z-50">
          <div className="p-4 flex flex-col gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded">Home</Link>
            <Link to="/about" className="p-2 hover:bg-gray-100 rounded">About</Link>
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md text-center">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;