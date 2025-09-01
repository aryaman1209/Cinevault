import React from "react";
import { Search } from "lucide-react";

export default function Navbar({
  query,
  setQuery,
  openSearch,
  platform,
  setPlatform,
  openMyList,
  genresList
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b0b0d]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=200&auto=format&fit=crop"
            alt="logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="font-extrabold text-lg tracking-wide">CINEVAULT</div>
          <div className="hidden md:flex items-center gap-2 text-sm text-zinc-300 ml-4">
            <button className="hover:text-white">Home</button>
            <button className="hover:text-white">Movies</button>
            <button className="hover:text-white">Series</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-zinc-900 rounded-xl px-3 py-1.5 gap-2">
            <Search className="text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={openSearch}
              placeholder="Search movies, shows..."
              className="bg-transparent text-sm outline-none placeholder:text-zinc-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-1 ring-1 ring-white/6">
            {["All", "Netflix", "Prime"].map((opt) => (
              <button
                key={opt}
                onClick={() => setPlatform(opt)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${platform === opt ? "bg-white text-black" : "text-zinc-300 hover:bg-zinc-800"}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button onClick={openMyList} className="ml-2 text-sm text-zinc-300 hover:text-white">My List</button>
        </div>
      </div>
    </header>
  );
}
