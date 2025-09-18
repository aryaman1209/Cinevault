import React from "react";

const Navbar = ({
  query,
  setQuery,
  openSearch,
  platform,
  setPlatform,
  openMyList
}) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img
          src="/cinevault-logo.png"
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
          <button
            aria-label="Open search"
            className="text-gray-400 mr-2"
            onClick={openSearch}
          >
            🔍
          </button>
          <input
            type="text"
            placeholder="Search movies, shows..."
            className="bg-transparent outline-none text-white w-60"
            value={query}
            onChange={(e) => setQuery?.(e.target.value)}
            onFocus={openSearch}
          />
        </div>

        {/* Platform Filter */}
        <div className="flex gap-2 bg-neutral-900 px-2 py-1 rounded-lg">
          <button
            className={`${platform === "All" ? "bg-white text-black font-semibold" : "hover:bg-gray-700"} px-3 py-1 rounded-lg`}
            onClick={() => setPlatform?.("All")}
          >
            All
          </button>
          <button
            className={`${platform === "Netflix" ? "bg-white text-black font-semibold" : "hover:bg-gray-700"} px-3 py-1 rounded-lg`}
            onClick={() => setPlatform?.("Netflix")}
          >
            Netflix
          </button>
          <button
            className={`${platform === "Prime" ? "bg-white text-black font-semibold" : "hover:bg-gray-700"} px-3 py-1 rounded-lg`}
            onClick={() => setPlatform?.("Prime")}
          >
            Prime
          </button>
        </div>

        {/* My List */}
        <button onClick={openMyList} className="hover:text-red-500 cursor-pointer">My List</button>
      </div>
    </nav>
  );
};

export default Navbar;
