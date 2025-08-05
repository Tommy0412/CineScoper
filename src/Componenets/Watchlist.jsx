import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        setWatchlist(JSON.parse(localStorage.getItem("watchlist")) || []);
    }, []);

    const removeFromWatchlist = (id) => {
        const updatedWatchlist = watchlist.filter((movie) => movie.id !== id);
        setWatchlist(updatedWatchlist);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    };

    return (
        <div className="container mx-auto mt-20 text-white px-4">
            <h1 className="text-center text-2xl font-bold mb-5">Watchlist</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlist.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">
                        No movies/shows in watchlist
                    </p>
                ) : (
                    watchlist.map((item) => (
						<div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col items-center p-2">
						    <h5 className="text-white font-semibold text-md text-center truncate w-full mb-2">
                            {item.title || item.name}
                            </h5>
                            <Link to={`/show/${item.type}/${item.id}`}>
                                <img 
								    loading="lazy"
									src={item.poster
                                    ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/w500${item.poster}&w=300&h=450&output=webp`
                                    : '/no_image.svg'}
                                    alt={item.title || item.name} 
									className="w-[200px] h-[300px] object-cover rounded"
                                />
                            </Link>
					    <button 
                           onClick={() => removeFromWatchlist(item.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                         >
                         Remove
                        </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Watchlist;