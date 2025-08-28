import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookmarkPlus,
  Play,
  Search,
  Film,
  TvMinimalPlay,
  Sparkles,
} from "lucide-react";

/**
 * CineVault – Advanced React UI
 * ------------------------------------------------------------
 * - TailwindCSS for styling
 * - Framer Motion for micro-interactions
 * - Lucide icons
 * - Platform filter: Netflix | Prime | Both
 * - Genre rows with horizontally scrollable movie cards
 * - Hover cards show details + quick actions
 * - AI Recommendation section (mocked)
 * - Dummy dataset; swap with TMDB results easily
 */

// --- Mock dataset (replace with TMDB) ---------------------------------------
const MOVIES = [
  {
    id: "st",
    title: "Stranger Things",
    year: 2016,
    rating: 8.7,
    platform: "Netflix",
    genres: ["Sci‑Fi", "Thriller"],
    poster:
      "https://image.tmdb.org/t/p/w342/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    overview:
      "A group of kids uncover supernatural mysteries in a small town.",
    type: "TV",
  },
  {
    id: "bh",
    title: "The Boys",
    year: 2019,
    rating: 8.5,
    platform: "Prime",
    genres: ["Action", "Dark Comedy"],
    poster:
      "https://image.tmdb.org/t/p/w342/stTEycfG9928HYGEISBFaG1ngjM.jpg",
    overview:
      "A ragtag crew battles corrupt superheroes backed by a mega‑corp.",
    type: "TV",
  },
  {
    id: "mi",
    title: "Mission: Impossible – Fallout",
    year: 2018,
    rating: 7.7,
    platform: "Prime",
    genres: ["Action", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w342/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    overview: "Ethan Hunt races time after a mission goes wrong.",
    type: "Movie",
  },
  {
    id: "mm",
    title: "Money Heist",
    year: 2017,
    rating: 8.3,
    platform: "Netflix",
    genres: ["Crime", "Thriller"],
    poster:
      "https://image.tmdb.org/t/p/w342/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    overview: "A criminal mastermind orchestrates the biggest heists in history.",
    type: "TV",
  },
  {
    id: "jk",
    title: "Joker",
    year: 2019,
    rating: 8.4,
    platform: "Prime",
    genres: ["Drama", "Crime"],
    poster: "https://image.tmdb.org/t/p/w342/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    overview: "A bleak origin story of Gotham's infamous clown prince.",
    type: "Movie",
  },
  {
    id: "ww",
    title: "Wednesday",
    year: 2022,
    rating: 8.2,
    platform: "Netflix",
    genres: ["Mystery", "Comedy"],
    poster:
      "https://image.tmdb.org/t/p/w342/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    overview: "Wednesday Addams investigates a spree of monstrous murders.",
    type: "TV",
  },
];

const ALL_GENRES = [
  "Action",
  "Comedy",
  "Crime",
  "Drama",
  "Mystery",
  "Sci‑Fi",
  "Thriller",
  "Dark Comedy",
];

// --- UI atoms ---------------------------------------------------------------
const Badge = ({ label, tone = "neutral" }) => (
  <span
    className={
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
      (tone === "netflix"
        ? "bg-red-600/15 text-red-500 ring-1 ring-red-500/30"
        : tone === "prime"
        ? "bg-blue-600/15 text-blue-400 ring-1 ring-blue-400/30"
        : "bg-zinc-600/20 text-zinc-300 ring-1 ring-white/10")
    }
  >
    {label}
  </span>
);

const PlatformToggle = ({ value, onChange }) => (
  <div className="flex items-center gap-2 rounded-xl bg-zinc-900 p-1 ring-1 ring-white/10">
    {[
      { key: "All", tone: "neutral" },
      { key: "Netflix", tone: "netflix" },
      { key: "Prime", tone: "prime" },
    ].map((opt) => (
      <button
        key={opt.key}
        onClick={() => onChange(opt.key)}
        className={`px-3 py-1.5 text-sm rounded-lg transition ${
          value === opt.key
            ? "bg-white text-black"
            : "text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        {opt.key}
      </button>
    ))}
  </div>
);

const SectionHeader = ({ title, icon }) => (
  <div className="mb-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
    </div>
    <button className="text-sm text-zinc-400 hover:text-white">See all</button>
  </div>
);

const Card = ({ item }) => {
  const tone = item.platform === "Netflix" ? "netflix" : "prime";
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative w-48 shrink-0 cursor-pointer"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10">
        <img
          src={item.poster}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.06]"
          loading="lazy"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <p className="text-xs text-zinc-400">{item.year} • {item.type}</p>
        </div>
        <Badge label={item.platform} tone={tone} />
      </div>

      {/* Hover reveal */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/0 to-black/0 p-3 opacity-0"
      >
        <div className="absolute bottom-3 left-3 right-3 space-y-2">
          <p className="line-clamp-2 text-xs text-zinc-200">{item.overview}</p>
          <div className="flex items-center gap-2">
            <button className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-black">
              <Play size={14} /> Play
            </button>
            <button className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-zinc-900/80 px-2.5 py-1 text-xs ring-1 ring-white/20">
              <BookmarkPlus size={14} /> Watchlist
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Row = ({ title, items, icon }) => (
  <section className="mb-8">
    <SectionHeader title={title} icon={icon} />
    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
      {items.map((m) => (
        <Card key={m.id} item={m} />
      ))}
    </div>
  </section>
);

// --- Main app ---------------------------------------------------------------
export default function CineVault() {
  const [platform, setPlatform] = useState("All");
  const [query, setQuery] = useState("");
  const [aiRecs, setAiRecs] = useState([]);

  const filtered = useMemo(() => {
    return MOVIES.filter((m) =>
      (platform === "All" || m.platform === platform) &&
      (query.trim() === "" || m.title.toLowerCase().includes(query.toLowerCase()))
    );
  }, [platform, query]);

  const byGenre = useMemo(() => {
    const map = Object.fromEntries(ALL_GENRES.map((g) => [g, []]));
    filtered.forEach((m) => {
      m.genres.forEach((g) => {
        if (!map[g]) map[g] = [];
        map[g].push(m);
      });
    });
    return map;
  }, [filtered]);

  // Simulate AI recommendations (mock)
  useEffect(() => {
    if (query || platform !== "All") {
      setAiRecs(filtered.slice(0, 3));
    } else {
      setAiRecs(MOVIES.sort(() => 0.5 - Math.random()).slice(0, 3));
    }
  }, [filtered, platform, query]);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0d]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Fox + brand */}
            <img
              src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=200&auto=format&fit=crop"
              alt="logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xl font-extrabold tracking-wide">CINEVAULT</span>
            <Badge label="AI Enhanced" />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 ring-1 ring-white/10 md:flex">
              <Search size={16} className="text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, shows…"
                className="w-64 bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>
            <PlatformToggle value={platform} onChange={setPlatform} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Featured hero */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600/20 via-purple-700/10 to-blue-600/20 p-6 ring-1 ring-white/10"
        >
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">All your shows, one vault.</h1>
              <p className="mt-1 max-w-xl text-sm text-zinc-300">
                Browse by genre and platform. Get smart cross‑platform recommendations
                powered by AI insights.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label="Netflix" tone="netflix" />
              <Badge label="Prime" tone="prime" />
            </div>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        {aiRecs.length > 0 && (
          <section className="mb-10">
            <SectionHeader
              title="AI Picks For You"
              icon={<Sparkles size={18} className="text-yellow-400" />}
            />
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {aiRecs.map((m) => (
                <Card key={m.id} item={m} />
              ))}
            </div>
          </section>
        )}

        {/* Genre rows */}
        {ALL_GENRES.map((genre) => {
          const items = byGenre[genre] || [];
          if (items.length === 0) return null;
          const icon =
            genre === "Action" ? (
              <Film size={18} className="text-zinc-400" />
            ) : genre === "Mystery" ? (
              <TvMinimalPlay size={18} className="text-zinc-400" />
            ) : (
              <Film size={18} className="text-zinc-400" />
            );
          return <Row key={genre} title={genre} items={items} icon={icon} />;
        })}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} CineVault · For educational demo purposes.
      </footer>
    </div>
  );
}
