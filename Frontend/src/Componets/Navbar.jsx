import React from "react";
import logo from "../assets/Images/Bgimage.jpg"; 

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center p-4 bg-black">
      {/* Left side: Logo */}
      <div className="logo">
        <img
          src={logo} 
          alt="Logo"
          className="w-28 h-12"
        />
      </div>

{/* 
      <div className="flex gap-4">
        <button className="px-4 py-2 border border-white bg-black hover:bg-gray-600 text-white hover:text-white  rounded-md">
          Login
        </button>
        <button className="px-4 py-2 border border-black bg-white text-black hover:bg-gray-600 hover:text-white hover:border hover:border-white rounded-md">
          Register
        </button>
      </div>
      */}
    </nav>
  );
};

export default Navbar;
