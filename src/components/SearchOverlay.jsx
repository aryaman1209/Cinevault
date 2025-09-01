import React, { useEffect, useState } from "react";
import { searchMulti } from "../api/tmdb";
import { IMG } from "../api/tmdb";
import { motion } from "framer-motion";

export default function SearchOverlay({ open, onClose, initialQuery, onPlay, onAddToList }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [results, setResults] = useState([]);
  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  useEffect(() => {
    let mounted = true;
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const res = await searchMulti(query);
      if (mounted) setResults(res);
    }, 350);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [query]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-6">
      <div className="mx-auto max-w-6xl rounded-lg bg-[#0b0b0d] p-6">
        <div className="flex items-center gap-4 mb-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 px-4 py-3 rounded text-white outline-none"
            placeholder="Search for movies, TV shows, people..."
          />
          <button onClick={onClose} className="text-sm text-zinc-400">Close</button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.length === 0 && <div className="text-zinc-400">No live results yet.</div>}
            {results.map((r) => (
              <div key={r.id} className="bg-zinc-900/30 rounded p-2">
                <img src={IMG(r.poster_path)} alt={r.title || r.name} className="w-full h-48 object-cover rounded" />
                <div className="mt-2 flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{r.title || r.name}</div>
                    <div className="text-xs text-zinc-400">{(r.release_date||r.first_air_date||"").slice(0,4)}</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => onPlay(r)} className="bg-white text-black px-3 py-1 rounded text-sm">Play</button>
                  <button onClick={() => onAddToList(r)} className="bg-zinc-900/80 px-3 py-1 rounded text-sm">My List</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
