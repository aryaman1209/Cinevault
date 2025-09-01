import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Row from "./components/Row";
import SearchOverlay from "./components/SearchOverlay";
import PlayerModal from "./components/PlayerModal";
import {
  trending,
  discover,
  getGenres,
  searchMulti,
  getRecommendations,
  getVideos,
  PROVIDER_IDS,
} from "./api/tmdb";
import { Sparkles, Play } from "lucide-react"; // ✅ Added Play import

export default function App() {
  const [platform, setPlatform] = useState("All"); // "All" | "Netflix" | "Prime"
  const [query, setQuery] = useState("");
  const [heroItem, setHeroItem] = useState(null);
  const [trendingNow, setTrendingNow] = useState([]);
  const [netflixItems, setNetflixItems] = useState([]);
  const [primeItems, setPrimeItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerUrl, setPlayerUrl] = useState(null);
  const [myList, setMyList] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRating, setFilterRating] = useState("");

  // load myList from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cinevault_list") || "[]");
    setMyList(stored);
  }, []);

  // Save list to localStorage
  useEffect(() => {
    localStorage.setItem("cinevault_list", JSON.stringify(myList));
  }, [myList]);

  // Load initial data
  useEffect(() => {
    (async () => {
      try {
        const [tr, g] = await Promise.all([
          trending("all", "week"),
          getGenres("movie"),
        ]);
        setTrendingNow(tr);
        setHeroItem(tr.find((t) => t.backdrop_path) || tr[0]);
        setGenres(g);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // fetch provider catalogs (first page) and store
  useEffect(() => {
    (async () => {
      try {
        const [netM, netT] = await Promise.all([
          discover("movie", { providerId: PROVIDER_IDS.Netflix }),
          discover("tv", { providerId: PROVIDER_IDS.Netflix }),
        ]);
        const [primeM, primeT] = await Promise.all([
          discover("movie", { providerId: PROVIDER_IDS.Prime }),
          discover("tv", { providerId: PROVIDER_IDS.Prime }),
        ]);
        const net = [...netM, ...netT].map((x) => ({
          ...x,
          platform: "Netflix",
        }));
        const pr = [...primeM, ...primeT].map((x) => ({
          ...x,
          platform: "Prime",
        }));
        setNetflixItems(net);
        setPrimeItems(pr);
        setAllItems([...net, ...pr]);
        setAiPicks((prev) => (prev.length ? prev : [...net, ...pr].slice(0, 10)));
      } catch (err) {
        console.error("provider fetch", err);
      }
    })();
  }, []);

  // AI picks: when query changes, search and fetch recommendations for first result
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) return;
      try {
        const res = await searchMulti(query);
        if (res.length > 0) {
          const first = res[0];
          const type = first.media_type === "tv" ? "tv" : "movie";
          const recs = await getRecommendations(type, first.id);
          setAiPicks(recs.slice(0, 12));
        }
      } catch (e) {
        console.error("ai picks search", e);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [query]);

  // helper: toggle my list
  function toggleMyList(item) {
    const exists = myList.some(
      (x) => x.id === item.id && x.platform === item.platform
    );
    if (exists)
      setMyList((p) =>
        p.filter((x) => !(x.id === item.id && x.platform === item.platform))
      );
    else setMyList((p) => [...p, item]);
  }

  // Play: get trailer and open player
  async function handlePlay(item) {
    const type = item.media_type === "tv" ? "tv" : "movie";
    const videos = await getVideos(type, item.id);
    const yt = videos.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.type === "Teaser")
    );
    if (yt) setPlayerUrl(`https://www.youtube.com/watch?v=${yt.key}`);
    else setPlayerUrl(null);
    setPlayerOpen(true);
  }

  // Filtered items for rows
  const filteredItems = useMemo(() => {
    let items = allItems.slice();
    if (platform === "Netflix")
      items = items.filter((i) => i.platform === "Netflix");
    if (platform === "Prime")
      items = items.filter((i) => i.platform === "Prime");
    if (filterGenre)
      items = items.filter((i) =>
        (i.genre_ids || []).includes(Number(filterGenre))
      );
    if (filterYear)
      items = items.filter(
        (i) =>
          (i.release_date || i.first_air_date || "").slice(0, 4) ===
          String(filterYear)
      );
    if (filterRating)
      items = items.filter(
        (i) => (i.vote_average || 0) >= Number(filterRating)
      );
    return items;
  }, [allItems, platform, filterGenre, filterYear, filterRating]);

  // convenience rows (take slices)
  const trendingRow = trendingNow.slice(0, 12);
  const aiRow = aiPicks;

  // years for filter
  const years = useMemo(() => {
    const s = new Set();
    allItems.forEach((i) => {
      const y = (i.release_date || i.first_air_date || "").slice(0, 4);
      if (y) s.add(y);
    });
    return Array.from(s).sort((a, b) => b - a).slice(0, 30);
  }, [allItems]);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <Navbar
        query={query}
        setQuery={setQuery}
        openSearch={() => setSearchOpen(true)}
        platform={platform}
        setPlatform={setPlatform}
        openMyList={() => {
          /* handled below */
        }}
      />

      <main className="mx-auto max-w-7xl px-4 pb-20">
        <Hero hero={heroItem} onPlay={handlePlay} onAdd={toggleMyList} />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Explore</h2>
            <p className="text-xs text-zinc-400">
              Browse Netflix & Prime catalogs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Genre */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="rounded-md bg-zinc-900 px-3 py-1 text-sm"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {/* Year */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="rounded-md bg-zinc-900 px-3 py-1 text-sm"
            >
              <option value="">Any Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {/* Rating */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="rounded-md bg-zinc-900 px-3 py-1 text-sm"
            >
              <option value="">Any Rating</option>
              <option value="9">9+</option>
              <option value="8">8+</option>
              <option value="7">7+</option>
              <option value="6">6+</option>
            </select>
          </div>
        </div>

        {/* AI Picks row */}
        {aiRow.length > 0 && (
          <section className="mb-8 rounded-2xl border border-yellow-400/20 bg-yellow-500/5 p-4 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="text-yellow-400" />
              <h3 className="text-lg font-semibold">AI Picks For You</h3>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {aiRow.map((m) => (
                <div
                  key={`ai-${m.id}`}
                  className="group relative shrink-0 w-44 cursor-pointer"
                  onClick={() => handlePlay(m)}
                >
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
                        : ""
                    }
                    alt={m.title || m.name}
                    className="rounded-lg w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg">
                    <Play className="h-10 w-10 text-white" />
                  </div>

                  <p className="mt-2 text-sm text-center truncate">
                    {m.title || m.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rows */}
        <Row
          title="Trending Now"
          items={trendingRow}
          onToggleList={toggleMyList}
          listItems={myList}
          onPlay={handlePlay}
        />
        <Row
          title="Netflix Picks"
          items={filteredItems
            .filter((i) => i.platform === "Netflix")
            .slice(0, 20)}
          onToggleList={toggleMyList}
          listItems={myList}
          onPlay={handlePlay}
        />
        <Row
          title="Prime Picks"
          items={filteredItems
            .filter((i) => i.platform === "Prime")
            .slice(0, 20)}
          onToggleList={toggleMyList}
          listItems={myList}
          onPlay={handlePlay}
        />

        {/* Results grid fallback */}
        <section className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.slice(0, 18).map((i) => (
              <div
                key={`${i.platform}-${i.id}`}
                className="rounded-md overflow-hidden bg-zinc-900/30"
              >
                <img
                  src={
                    i.poster_path
                      ? `https://image.tmdb.org/t/p/w342${i.poster_path}`
                      : ""
                  }
                  alt={i.title || i.name}
                  className="w-full h-56 object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <PlayerModal
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        youtubeUrl={playerUrl}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialQuery={query}
        onPlay={(item) => {
          setSearchOpen(false);
          handlePlay(item);
        }}
        onAddToList={(item) => {
          toggleMyList(item);
        }}
      />
    </div>
  );
}
