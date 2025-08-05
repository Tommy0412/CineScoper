import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Keywords = () => {
	const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const baseImgUrl = 'https://image.tmdb.org/t/p/w500';
    const placeholderImgUrl = '/no_image.svg';
    const { id } = useParams();
    const [keywordTitle, setKeywordTitle] = useState('');
    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const page = new URLSearchParams(window.location.search).get('page') || 1;
        setCurrentPage(Number(page));
        fetchKeywordTitle(id);
        fetchMoviesByKeyword(id, currentPage);
    }, [id, currentPage]);

    const fetchKeywordTitle = async (id) => {
        const response = await fetch(`https://api.themoviedb.org/3/keyword/${id}?api_key=${apiKey}`);
        const data = await response.json();
        const keywordName = data.name;

        document.title = `Embedsito - Movies & TV shows - Keyword ${keywordName} watch online`;
        setKeywordTitle(`Embedsito - Movies & TV shows - Keyword ${keywordName} watch online`);

        const canonicalUrl = `${window.location.origin}/keywords/${id}`;
        const link = document.querySelector("link[rel='canonical']") || document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
    };

    const fetchMoviesByKeyword = async (id, page) => {
        const response = await fetch(`https://api.themoviedb.org/3/keyword/${id}/movies?api_key=${apiKey}&page=${page}`);
        const data = await response.json();

        setResults(data.results);
        setTotalPages(data.total_pages);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
        fetchMoviesByKeyword(id, page);
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto mt-20">
            <h1 className="text-center text-2xl font-bold text-white mb-5">{keywordTitle}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map(result => (
                    <div className="bg-gray-900 p-2 rounded-lg shadow-md" key={result.id}>
                        <Link to={`/show/movie/${result.id}`} className="block overflow-hidden rounded-lg">
                            <img
                                src={result.poster_path ? `https://wsrv.nl/?url=${baseImgUrl}${result.poster_path}&w=300&h=300&output=webp` : placeholderImgUrl}
                                className="w-full h-auto aspect-[2/3] object-cover rounded"
                                alt={result.title || result.name}
                            />
                        </Link>
                        <div className="mt-2 text-center">
                            <h5 className="text-white font-semibold text-md truncate">{result.title || result.name}</h5>
                            <p className="text-gray-300 text-white mt-1">
                                {result.release_date ? result.release_date.substring(0, 4) : 'N/A'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <nav aria-label="Page navigation" className="flex justify-center mt-6">
                <ul className="flex space-x-4">
                    <li className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                            }}
                            disabled={currentPage === 1}
                        >
                            &larr; Previous
                        </button>
                    </li>
                    <li className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                            }}
                            disabled={currentPage === totalPages}
                        >
                            Next &rarr;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Keywords;