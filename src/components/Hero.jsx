import React from "react";
import { IMG } from "../api/tmdb";

export default function Hero({ hero, onPlay, onAdd }) {
  if (!hero) return null;
  const title = hero.title || hero.name || "Featured";
  return (
    <section className="relative mb-8">
      <div className="relative h-[56vh] overflow-hidden rounded-b-2xl">
        <img
          src={IMG(hero.backdrop_path, "w1280")}
          alt={title}
          className="h-full w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent" />
        <div className="absolute left-8 bottom-8 max-w-2xl">
          <h1 className="text-4xl font-extrabold drop-shadow mb-3">{title}</h1>
          <p className="max-w-xl text-sm text-zinc-200 line-clamp-3">{hero.overview}</p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => onPlay(hero)} className="rounded-xl bg-white px-5 py-2 text-black font-semibold">Play</button>
            <button onClick={() => onAdd(hero)} className="rounded-xl bg-zinc-900/70 px-5 py-2 text-sm ring-1 ring-white/10">My List</button>
          </div>
        </div>
      </div>
    </section>
  );
}
