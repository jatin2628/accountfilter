import React from 'react';

function Navbar() {
    return (
      <nav className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">3B2 Bill Verifier</h1>
          <div className="text-lg">
            <a href="#home" className="px-4 hover:text-indigo-300">Home</a>
            <a href="#about" className="px-4 hover:text-indigo-300">About</a>
            <a href="#contact" className="px-4 hover:text-indigo-300">Contact</a>
          </div>
        </div>
      </nav>
    );
  }
  

export default Navbar;
