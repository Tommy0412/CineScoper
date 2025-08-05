import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ShowActions({ id, type }) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [data, setData] = useState({});
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`
        );
        const json = await response.json();
        setData(json);
        fetchTrailer();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchTrailer = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailerData = await response.json();
        const officialTrailer = trailerData.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(officialTrailer ? officialTrailer.key : null);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };

    fetchData();
  }, [id, type, apiKey]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const item = {
      id,
      type,
      title: data.title || data.name,
      poster: data.poster_path,
    };

    if (!watchlist.some((movie) => movie.id === id)) {
      watchlist.push(item);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert("Added to watchlist!");
    } else {
      alert("Already in watchlist!");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex gap-4">
        <button
          onClick={addToWatchlist}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add to Watchlist
        </button>

        <Link
          to="/watchlist"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          View Watchlist
        </Link>

        {trailer && (
          <button
            onClick={() => setShowTrailer(true)}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
          >
            Watch Trailer
          </button>
        )}
      </div>

      {showTrailer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative w-[90%] h-[50%] md:w-[80%] md:h-[60%]">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer}`}
              frameBorder="0"
              allowFullScreen
              title="Trailer"
            ></iframe>
            <button
              className="absolute top-0 right-0 text-white text-2xl"
              onClick={() => setShowTrailer(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowActions;