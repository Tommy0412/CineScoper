import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const PLACEHOLDER_IMAGE = '/no_image.svg';

const ActorMovies = () => {
  const { actorName } = useParams();
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState('movie');
  const [totalPages, setTotalPages] = useState(1);
  const [actorId, setActorId] = useState(null);

  useEffect(() => {
    document.title = `Watch Movies & TV Shows by ${actorName} Online`;
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `${window.location.origin}/casts/${actorName}`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [actorName]);

  useEffect(() => {
    const fetchActorId = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actorName)}`
        );
        const data = await response.json();

        if (data.results.length === 0) {
          setActorId(null);
          return;
        }

        const normalizedActorName = actorName.trim().toLowerCase();
        const exactMatch = data.results.find((result) =>
          result.name.trim().toLowerCase() === normalizedActorName
        );

        const actingActor = exactMatch || data.results.find(
          (result) => result.known_for_department === "Acting"
        );

        setActorId(actingActor ? actingActor.id : data.results[0]?.id);
      } catch (error) {
        console.error("Error fetching actor ID:", error);
        setActorId(null);
      }
    };

    fetchActorId();
  }, [actorName]);

  useEffect(() => {
    if (!actorId) return;

    const fetchData = async () => {
      try {
        let data;

        if (mediaType === 'movie') {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_people=${actorId}&page=${page}`
          );
          data = await response.json();
        } else {
          const response = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=${API_KEY}`
          );
          data = await response.json();
          data.results = data.cast;
        }

        if (!data.results || data.results.length === 0) {
          setResults([]);
          setTotalPages(1);
          return;
        }

        const resultsWithCredits = await Promise.all(
          data.results.map(async (item) => {
            const creditsUrl = mediaType === 'movie'
              ? `https://api.themoviedb.org/3/movie/${item.id}/credits?api_key=${API_KEY}`
              : `https://api.themoviedb.org/3/tv/${item.id}/credits?api_key=${API_KEY}`;

            const creditsResponse = await fetch(creditsUrl);
            const creditsData = await creditsResponse.json();

            const isCast = creditsData.cast.some(member => member.id === actorId);
            const isDirector = creditsData.crew.find(member => member.job === 'Director' || member.job === 'Creator');
            const isWriter = creditsData.crew.find(member => ['Writer', 'Screenplay', 'Creator'].includes(member.job));

            if (!isCast && !isDirector && !isWriter) return null;

            return {
              ...item,
              director: isDirector ? isDirector.name : 'N/A',
              writer: isWriter ? isWriter.name : 'N/A',
            };
          })
        );

        setResults(resultsWithCredits.filter(item => item !== null));
        setTotalPages(mediaType === 'movie' ? data.total_pages : 1);
      } catch (error) {
        console.error('Error fetching data:', error);
        setResults([]);
        setTotalPages(1);
      }
    };

    fetchData();
  }, [actorId, mediaType, page]);

  const handleToggle = () => {
    setMediaType(prev => (prev === 'movie' ? 'tv' : 'movie'));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const schemaData =
    results.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": mediaType === "movie" ? "Movie" : "TVSeries",
          name: mediaType === "movie" ? results[0].title : results[0].name,
          description:
            results[0].overview ||
            `Watch ${mediaType === 'movie' ? results[0].title : results[0].name}`,
          image: results[0].poster_path
            ? `https://image.tmdb.org/t/p/w500${results[0].poster_path}`
            : undefined,
          director:
            results[0].director && results[0].director !== "N/A"
              ? { "@type": "Person", name: results[0].director }
              : undefined,
          url: typeof window !== "undefined" ? window.location.href : "",
          potentialAction: {
            "@type": "WatchAction",
            target: typeof window !== "undefined" ? window.location.href : "",
            expectsAcceptanceOf: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              price: "0",
              priceCurrency: "USD",
            },
          },
        }
      : null;

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <div className="container mx-auto mt-20 text-white">
        <h1 className="text-center text-2xl font-bold mb-5">
          {mediaType === 'movie' ? 'Movies' : 'TV Shows'} by {actorName}
        </h1>

        <button
          onClick={handleToggle}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded mb-8 mx-auto block hover:bg-blue-700"
        >
          {mediaType === 'movie' ? 'Switch to TV Shows' : 'Switch to Movies'}
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.length === 0 && (
            <div className="col-span-full text-center text-white">
              <p>No {mediaType === 'movie' ? 'movies' : 'TV shows'} found for this person.</p>
            </div>
          )}
          {results.map(item => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg max-w-[200px]">
              <Link to={`/show/${mediaType}/${item.id}`}>
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : PLACEHOLDER_IMAGE
                  }
                  alt={mediaType === 'movie' ? item.title : item.name}
                  className="w-full h-auto aspect-[2/3] object-cover rounded"
                />
              </Link>
              <div className="mt-2 text-center p-2">
                <h5 className="text-white font-semibold text-md truncate">
                  {mediaType === 'movie' ? item.title : item.name}
                </h5>
                <p className="text-gray-400 text-xs">Director: {item.director}</p>
                <p className="text-gray-400 text-xs">Writer: {item.writer}</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10 text-white">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className={`px-4 py-2 rounded ${page <= 1 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Previous
            </button>
            <span className="font-semibold">Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className={`px-4 py-2 rounded ${page >= totalPages ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ActorMovies;