import React, { useState } from "react";
import { Play, BookmarkPlus, Check } from "lucide-react";
import { IMG } from "../api/tmdb";
import { motion } from "framer-motion";

export default function MovieCard({ item, onToggleList, inList, onPlay }) {
  const [hover, setHover] = useState(false);
  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-44 shrink-0 cursor-pointer"
      whileHover={{ y: -6 }}
    >
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/8">
        <img src={IMG(item.poster_path)} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="text-xs text-zinc-400">{year} • {item.media_type?.toUpperCase() || "TITLE"}</p>
        </div>
      </div>

      {/* Hover overlay */}
      {hover && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3 flex flex-col justify-end">
          <p className="text-xs text-zinc-200 line-clamp-2 mb-2">{item.overview}</p>
          <div className="flex gap-2">
            <button onClick={() => onPlay(item)} className="bg-white text-black px-3 py-1 rounded text-sm inline-flex items-center gap-2">
              <Play size={14} /> Play
            </button>
            <button onClick={() => onToggleList(item)} className="bg-zinc-900/80 px-3 py-1 rounded text-sm inline-flex items-center gap-2 ring-1 ring-white/10">
              {inList ? <><Check size={14} /> Saved</> : <><BookmarkPlus size={14} /> My List</>}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
