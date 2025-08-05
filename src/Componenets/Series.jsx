import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function Series(props) {
	const { id } = useParams();
    const [series, setSeries] = useState([]);
    const [seriesName, setSeriesName] = useState('');
	const key = import.meta.env.VITE_TMDB_API_KEY;
    const placeholderImage = '/placeholder.png'; 

    useEffect(() => {
        const fetchSeriesData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${key}&language=en-US`);
                if (!response.ok) {
                    throw new Error('Failed to fetch series details');
                }
                const data = await response.json();
                setSeriesName(data.name); 
                document.title = `Watch ${data.name} Online`; 
                setSeries(data.seasons || []); 
            } catch (error) {
                console.error('Error fetching series data:', error);
            }
        };

        fetchSeriesData();
    }, [id, key]);

    return (
        <div className="w-full">
            <div className="relative py-3 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
                <h2 className="text-xl font-semibold"><i className="fa-solid fa-film mr-2"></i>Watch {seriesName} Onlne</h2>
            </div>
            <div className="my-4 grid grid-cols-7 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {series.map((season, index) => (
                    <div key={index} className={`relative flex flex-col items-start box-border p-2 text-left ${season.season_number === 0 && 'hidden'}`}>
                        <Link to={`/show/tv/${id}/s/${season.season_number}`} state={{ id: id, season: season.season_number }}>
                            <img 
                                loading="lazy" 
                                className="rounded-md w-full" 
                                src={season.poster_path ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${season.poster_path}&w=300&h=300&output=webp` : placeholderImage} 
                                alt={season.name} 
                            />
                        </Link>
                        <Link to={`/show/tv/${id}/s/${season.season_number}`} state={{ id: id, season: season.season_number }} className="text-white mt-2">{season.name}</Link>
                        <h3 className="text-gray">{season.air_date && season.air_date.slice(0, 4)}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Series;