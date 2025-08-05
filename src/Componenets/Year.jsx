import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Year = () => {
  const { year } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMovies, setShowMovies] = useState(true);
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (year && !isNaN(year) && year.length === 4) {
      fetchMoviesAndShows(year, currentPage);
    }
  }, [year, currentPage, showMovies]);

  useEffect(() => {
    document.title = `${showMovies ? 'Movies' : 'TV Shows'} from ${year} Watch Online`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${baseURL}/year/${year}`);
  }, [year, showMovies, baseURL]);

  const fetchMoviesAndShows = async (year, page = 1) => {
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}&language=en-US&sort_by=popularity.desc&page=${page}`;
    const showsUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&first_air_date_year=${year}&language=en-US&sort_by=popularity.desc&page=${page}`;

    try {
      const moviesData = await fetch(moviesUrl).then(res => res.json());
      const showsData = await fetch(showsUrl).then(res => res.json());

      if (showMovies) {
        setTotalPages(moviesData.total_pages);
        setResults(moviesData.results);
      } else {
        setTotalPages(showsData.total_pages);
        setResults(showsData.results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleShowType = () => {
    setShowMovies(prev => !prev);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto mt-20 text-white">
      <h1 className="text-center text-2xl font-bold mb-5">
        {showMovies ? 'Movies from' : 'TV Shows from'} {year} Year
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleShowType}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
         {showMovies ? 'Switch to TV Shows' : 'Switch to Movies'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" id="results">
        {results.length > 0 ? (
          results.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <Link to={`/show/${item.title ? 'movie' : 'tv'}/${item.id}`}>
                <img
                  src={item.poster_path
                    ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/w500${item.poster_path}&w=300&h=450&output=webp`
                    : '/no_image.svg'}
                  alt={item.title || item.name}
                  className="w-full h-auto aspect-[2/3] object-cover rounded"
                />
              </Link>
              <div className="mt-2 text-center">
                <h5 className="text-white font-semibold text-md truncate">{item.title || item.name}</h5>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No results found for {year}.</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Year;