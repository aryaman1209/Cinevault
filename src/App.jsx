import React, { useEffect, useState } from "react";
import { getTrending, getGenres, getByPlatform, searchMovies } from "./api/tmdb";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";

export default function App() {
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platform, setPlatform] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    getTrending().then(setTrending);
    getGenres().then(setGenres);
  }, []);

  const handleSearch = async () => {
    if (search.trim()) {
      const res = await searchMovies(search);
      setResults(res);
    }
  };

  const handlePlatform = async (id) => {
    setPlatform(id);
    const res = await getByPlatform(id);
    setResults(res);
  };

  const addToList = (item) => {
    const updated = [...myList, item];
    setMyList(updated);
    localStorage.setItem("myList", JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎬 CineVault Pro+</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handlePlatform(8)} // Netflix
            className="bg-red-600 px-4 py-2 rounded"
          >
            Netflix
          </button>
          <button
            onClick={() => handlePlatform(119)} // Prime
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Prime
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 mb-6">
        <input
          className="w-full p-2 rounded text-black"
          placeholder="Search for a movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 px-4 py-2 rounded flex items-center"
        >
          <Search className="mr-1" size={18} /> Search
        </button>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {(results.length ? results : trending).map((movie) => (
          <div key={movie.id} className="relative group">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg"
            />
            <button
              onClick={() => addToList(movie)}
              className="absolute top-2 right-2 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Plus size={18} />
            </button>
            <p className="text-sm mt-2">{movie.title}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
