import axios from "axios";

const BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const REGION = import.meta.env.VITE_TMDB_REGION || "US";

if (!API_KEY) console.warn("VITE_TMDB_KEY missing — add it to .env");

export const IMG = (path, size = "w342") => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "");

const client = axios.create({
  baseURL: BASE,
  params: { api_key: API_KEY }
});

export async function getGenres(type = "movie") {
  try {
    const { data } = await client.get(`/genre/${type}/list`, { params: { language: "en-US" } });
    return data.genres ?? [];
  } catch (e) {
    console.error("getGenres", e);
    return [];
  }
}

export async function trending(type = "all", time = "week") {
  try {
    const { data } = await client.get(`/trending/${type}/${time}`);
    return data.results ?? [];
  } catch (e) {
    console.error("trending", e);
    return [];
  }
}

/**
 * discover type: "movie" or "tv"
 * options: providerId (watch provider), withGenres (comma list of ids), sortBy, page, year, voteGte
 */
export async function discover(type = "movie", options = {}) {
  try {
    const params = {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: options.page || 1,
      sort_by: options.sortBy || "popularity.desc",
      watch_region: REGION
    };
    if (options.providerId) params.with_watch_providers = options.providerId;
    if (options.withGenres) params.with_genres = options.withGenres;
    if (options.year) params.primary_release_year = options.year;
    if (options.voteGte) params["vote_average.gte"] = options.voteGte;

    const { data } = await client.get(`/discover/${type}`, { params });
    return data.results ?? [];
  } catch (e) {
    console.error("discover", e);
    return [];
  }
}

export async function searchMulti(query, page = 1) {
  if (!query) return [];
  try {
    const { data } = await client.get(`/search/multi`, {
      params: { query, page, include_adult: false, language: "en-US" }
    });
    return data.results ?? [];
  } catch (e) {
    console.error("searchMulti", e);
    return [];
  }
}

export async function getRecommendations(type = "movie", id) {
  try {
    const { data } = await client.get(`/${type}/${id}/recommendations`, { params: { language: "en-US", page: 1 } });
    return data.results ?? [];
  } catch (e) {
    console.error("getRecommendations", e);
    return [];
  }
}

export async function getVideos(type = "movie", id) {
  try {
    const { data } = await client.get(`/${type}/${id}/videos`, { params: { language: "en-US" } });
    return data.results ?? [];
  } catch (e) {
    console.error("getVideos", e);
    return [];
  }
}

// Provider IDs: common IDs (confirm if needed per region)
export const PROVIDER_IDS = {
  Netflix: 8,
  Prime: 119
};
