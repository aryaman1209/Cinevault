import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img
          src="/cinevault-logo.png" // <-- Replace with your CineVault logo file
          alt="CineVault Logo"
          className="h-10 w-10 object-contain rounded-full"
        />
        <h1 className="text-2xl font-bold tracking-wide">CINEVAULT</h1>
      </div>

      {/* Menu Section */}
      <ul className="flex gap-6 text-lg font-medium">
        <li className="hover:text-red-500 cursor-pointer">Home</li>
        <li className="hover:text-red-500 cursor-pointer">Movies</li>
        <li className="hover:text-red-500 cursor-pointer">Series</li>
      </ul>

      {/* Search + Filter Section */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="flex items-center bg-neutral-900 px-3 py-2 rounded-lg">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search movies, shows..."
            className="bg-transparent outline-none text-white w-60"
          />
        </div>

        {/* Platform Filter */}
        <div className="flex gap-2 bg-neutral-900 px-2 py-1 rounded-lg">
          <button className="px-3 py-1 rounded-lg bg-white text-black font-semibold">
            All
          </button>
          <button className="px-3 py-1 rounded-lg hover:bg-gray-700">
            Netflix
          </button>
          <button className="px-3 py-1 rounded-lg hover:bg-gray-700">
            Prime
          </button>
        </div>

        {/* My List */}
        <span className="hover:text-red-500 cursor-pointer">My List</span>
      </div>
    </nav>
  );
};

export default Navbar;
