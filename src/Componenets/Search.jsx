import { useState, useEffect } from 'react';
import ShowCard from './ShowCard';

function Search() {
  const [query, setQuery] = useState('');
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState('vote_average');
  const [minVotes, setMinVotes] = useState(100);
  const [minRating, setMinRating] = useState(5);

  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [tvTotalPages, setTvTotalPages] = useState(1);

  const key = import.meta.env.VITE_TMDB_API_KEY;

  const handleQuery = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  useEffect(() => {
    if (!query) {
      setRawData([]);
      return;
    }

    async function fetchData() {
      const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
      const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;

      const [movieRes, tvRes] = await Promise.all([
        fetch(movieUrl).then(res => res.json()),
        fetch(tvUrl).then(res => res.json())
      ]);

      setMovieTotalPages(movieRes.total_pages || 1);
      setTvTotalPages(tvRes.total_pages || 1);

      const movies = (movieRes.results || []).map(item => ({ ...item, media_type: 'movie' }));
      const tvShows = (tvRes.results || []).map(item => ({ ...item, media_type: 'tv' }));

      let combined = [...movies, ...tvShows];

      combined = combined.filter(item =>
        item.vote_count >= minVotes &&
        item.vote_average >= minRating &&
        item.poster_path
      );

      combined.sort((a, b) => {
        if (sortBy === 'vote_average') return b.vote_average - a.vote_average;
        if (sortBy === 'vote_count') return b.vote_count - a.vote_count;
        if (sortBy === 'popularity') return b.popularity - a.popularity;
        return 0;
      });

      setRawData(combined);
    }

    fetchData();

    document.title = `Search Results for ${query} Watch Online`;
    const canonicalLink = document.querySelector("link[rel='canonical']");
    if (canonicalLink) {
      canonicalLink.href = window.location.href;
    } else {
      const newCanonicalLink = document.createElement("link");
      newCanonicalLink.rel = "canonical";
      newCanonicalLink.href = window.location.href;
      document.head.appendChild(newCanonicalLink);
    }

  }, [query, page, minVotes, minRating, sortBy]);

  const maxTotalPages = Math.max(movieTotalPages, tvTotalPages);

  const handlePrev = () => {
    setPage(p => Math.max(p - 1, 1));
  };
  const handleNext = () => {
    setPage(p => Math.min(p + 1, maxTotalPages));
  };

  return (
    <div className="mt-[5.3rem] mx-6 flex-col text-white">
      <input
        type="text"
        placeholder="Search Movie or TV Show..."
        className="rounded-md w-full py-3 px-5 bg-transparent border-2 border-gray text-white"
        onChange={handleQuery}
        value={query}
      />

      <div className="flex flex-wrap gap-4 mt-4 items-center">
        <div>
          <label className="mr-2">Sort by:</label>
          <select className="bg-black border px-2 py-1 rounded" onChange={e => setSortBy(e.target.value)} value={sortBy}>
            <option value="vote_average">Rating</option>
            <option value="vote_count">Votes</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Min Votes:</label>
          <input
            type="number"
            className="bg-black border px-2 py-1 rounded w-20"
            value={minVotes}
            onChange={e => setMinVotes(Number(e.target.value))}
            min={0}
          />
        </div>
        <div>
          <label className="mr-2">Min Rating:</label>
          <input
            type="number"
            className="bg-black border px-2 py-1 rounded w-20"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            min={0} max={10} step={0.1}
          />
        </div>
        <button
          className="bg-red-600 px-3 py-1 rounded"
          onClick={() => {
            setSortBy('vote_average');
            setMinVotes(100);
            setMinRating(5);
            setPage(1);
          }}
        >
          Reset Filters
        </button>
      </div>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {rawData && rawData.length > 0 ? (
    rawData.map((item, idx) => {
      const isMovie = item.media_type === 'movie';
      const typePath = isMovie ? 'movie' : 'tv';
      const tmdbId = item.id;
      const url = `${window.location.origin}/show/${typePath}/${tmdbId}`;

      return (
        <div
          key={idx}
          className="bg-gray-900 rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <a href={url}>
            <img
              className="w-full h-auto"
              src={`https://wsrv.nl/?url=https://image.tmdb.org/t/p/w300${item.poster_path}&w=300&h=400&output=webp`}
              alt={item.title || item.name}
              loading="lazy"
            />
          </a>
          <div className="p-3">
            <h3 className="text-lg font-semibold">
              {item.title || item.name}
            </h3>
            <p className="text-sm text-gray-400">
              {item.release_date
                ? new Date(item.release_date).getFullYear()
                : item.first_air_date
                ? new Date(item.first_air_date).getFullYear()
                : 'N/A'}
            </p>
            <p className="text-yellow-400 text-sm mt-1">
              ⭐ {item.vote_average.toFixed(1)} ({item.vote_count})
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-gray-400 mt-4 col-span-full">No results found.</p>
  )}
</div>

      {rawData.length > 0 && (
        <div className="flex justify-center items-center my-4 gap-4">
          <button
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={handlePrev}
          >
            Prev
          </button>
          <span className="text-white">
            Page {page} / {maxTotalPages}
          </span>
          <button
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
            disabled={page === maxTotalPages}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;