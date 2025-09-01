import React, { useRef } from "react";
import MovieCard from "./MovieCard";
import SectionHeader from "./SectionHeader";

export default function Row({ title, items = [], onToggleList, listItems, onPlay }) {
  const ref = useRef();
  if (!items.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => {
            // simple scroll to the right for "See all"
            ref.current?.scrollBy({ left: 600, behavior: "smooth" });
          }}
          className="text-sm text-zinc-400 hover:text-white"
        >
          See all
        </button>
      </div>

      <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {items.map((m) => (
          <MovieCard
            key={`${m.platform || "any"}-${m.id}`}
            item={m}
            onToggleList={onToggleList}
            inList={listItems.some((x) => x.id === m.id && x.platform === m.platform)}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  );
}
