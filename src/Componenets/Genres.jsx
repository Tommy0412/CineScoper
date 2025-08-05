import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_GENRE_MOVIE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`;
const TMDB_GENRE_TV_URL = `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`;
const TMDB_SEARCH_MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=`;
const TMDB_SEARCH_TV_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=`;

const PLACEHOLDER_IMAGE = '/no_image.svg';

const Genres = () => {
    const { type, genreId, page: pageParam } = useParams();
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [results, setResults] = useState([]);
    const [currentMediaType, setCurrentMediaType] = useState(type);
    const [currentPage, setCurrentPage] = useState(Number(pageParam) || 1);
    const [totalPages, setTotalPages] = useState(1);
	const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const baseURL = `${parsedUrl.protocol}//${parsedUrl.host}`; 

    useEffect(() => {
        fetchGenres().then(() => {
            if (genreId) {
                searchByGenre(genreId, currentPage);
            }
        });
    }, [genreId, currentPage]);

useEffect(() => {
    const genre = genres.find(g => g.id === Number(genreId));
    const genreName = genre ? genre.name : 'Unknown Genre'; 

    document.title = `EmbedSito - Genres ${currentMediaType === 'movie' ? 'Movies' : 'TV Shows'} - Genre ${genreName} watch online`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${baseURL}/genres/${currentMediaType}/${genreId}/${currentPage}`);
}, [currentMediaType, genreId, currentPage, baseURL, genres]);


    const fetchGenres = async () => {
        const genreUrl = currentMediaType === 'movie' ? TMDB_GENRE_MOVIE_URL : TMDB_GENRE_TV_URL;

        try {
            const response = await fetch(genreUrl);
            const data = await response.json();
            setGenres(data.genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const searchByGenre = async (genreId, page = 1) => {
        const searchUrl = currentMediaType === 'movie' ? TMDB_SEARCH_MOVIE_URL : TMDB_SEARCH_TV_URL;

        try {
            const response = await fetch(`${searchUrl}${genreId}&page=${page}`);
            const data = await response.json();
            setResults(data.results);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleGenreClick = (id) => {
        navigate(`/genres/${currentMediaType}/${id}/1`);
        searchByGenre(id, 1);
    };

    const handlePagination = (direction) => {
        const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
        setCurrentPage(newPage);
        navigate(`/genres/${currentMediaType}/${genreId}/${newPage}`);
        searchByGenre(genreId, newPage);
    };

    return (
        <div className="container mx-auto mt-20 text-white">
            <h1 className="text-center text-2xl font-bold mb-5">Genres</h1>
            <div className="flex justify-center mt-4">
                <div className="w-full max-w-md">
                    <div id="genreList" className="text-center">
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg mx-2 shadow-md hover:bg-blue-500 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() => handleGenreClick(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((result) => (
                    <div key={result.id} className="bg-black rounded-lg shadow-md overflow-hidden transition-transform duration-200 transform hover:scale-105">
                        <Link to={`/show/${currentMediaType}/${result.id}`}>
                            <img
                                className="w-full h-auto aspect-[2/3] object-cover rounded"
                                src={result.poster_path ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/w500${result.poster_path}&w=300&h=300&output=webp` : PLACEHOLDER_IMAGE}
                                alt={result.title || result.name}
                            />
                        </Link>
                        <div className="mt-2 text-center">
                            <h5 className="text-white font-semibold text-md truncate">{result.title || result.name}</h5>
                            <p className="text-white">{(result.release_date || result.first_air_date || '').split('-')[0]}</p>
                        </div>
                    </div>
                ))}
            </div>

            <nav className="flex justify-center mt-6">
                <ul className="flex space-x-4">
                    <li>
                        <button
                            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            onClick={() => handlePagination('prev')}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    <li>
                        <button
                            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            onClick={() => handlePagination('next')}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Genres;