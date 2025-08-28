import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const REGION = import.meta.env.VITE_TMDB_REGION || "US";
const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
    region: REGION,
  },
});

// Trending
export const getTrending = async () => {
  const res = await tmdb.get("/trending/movie/week");
  return res.data.results;
};

// Search
export const searchMovies = async (query) => {
  const res = await tmdb.get("/search/movie", { params: { query } });
  return res.data.results;
};

// Genres
export const getGenres = async () => {
  const res = await tmdb.get("/genre/movie/list");
  return res.data.genres;
};

// By platform (Netflix=8, Prime=119 from TMDB watch providers)
export const getByPlatform = async (platformId) => {
  const res = await tmdb.get("/discover/movie", {
    params: { with_watch_providers: platformId, watch_region: REGION },
  });
  return res.data.results;
};
