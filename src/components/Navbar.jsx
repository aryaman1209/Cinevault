import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img
          src="/cinevault-logo.png"
          alt="CineVault Logo"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-2xl font-bold tracking-wide">CineVault</h1>
      </div>

      {/* Menu Section */}
      <ul className="flex gap-6 text-lg font-medium">
        <li className="hover:text-red-500 cursor-pointer">Home</li>
        <li className="hover:text-red-500 cursor-pointer">Movies</li>
        <li className="hover:text-red-500 cursor-pointer">Series</li>
        <li className="hover:text-red-500 cursor-pointer">My List</li>
      </ul>
    </nav>
  );
};

export default Navbar;
