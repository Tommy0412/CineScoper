import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function ShowHeader(props) {
    const { id, type } = props;

    function convertMinutesToHours(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    }

	const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const [data, setData] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [director, setDirector] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(type === "tv" ?
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US` :
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
                const data = await response.json();
                setData(data);
                fetchKeywords();
                fetchCredits(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
		
        fetchData();
    }, [id, type]);
	
    const fetchKeywords = async () => {
        try {
            const endpoint = type === "movie"
                ? `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`
                : `https://api.themoviedb.org/3/tv/${id}/keywords?api_key=${apiKey}`;
            const response = await fetch(endpoint);
            const data = await response.json();
            const extractedKeywords = type === "movie" ? data.keywords : data.results;

            setKeywords(extractedKeywords || []);
        } catch (error) {
            console.error("Failed to fetch keywords", error);
        }
    };

    const fetchCredits = async (data) => {
        if (type === 'tv') {
            const creator = data.created_by && data.created_by.length > 0 ? data.created_by[0].name : 'Unknown';
            setDirector(creator);
        } else if (type === 'movie') {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
                const credits = await response.json();
                const directorData = credits.crew.find(({ job }) => job === 'Director');
                setDirector(directorData ? directorData.name : 'Unknown');
            } catch (error) {
                console.error("Error fetching credits:", error);
            }
        }
    };

    const totalMinutes = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 0);
    const convertedTime = convertMinutesToHours(totalMinutes);
    const genres = data.genres || [];
    const genreName = genres.length > 0 ? genres[0].name : '';
    const genreId = genres.length > 0 ? genres[0].id : '';
    const date = data.release_date ? data.release_date.slice(0, 4) : data.first_air_date ? data.first_air_date.slice(0, 4) : null;

    const maxMobileWidth = 375;
    const maxDesktopWidth = 1000;
    const maxOverviewLengthMobile = 150;
    const maxOverviewLengthDesktop = 300;

    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= maxMobileWidth;
    const isDesk = windowWidth <= maxDesktopWidth;

    const truncatedOverview =
        data.overview &&
        (isMobile
            ? data.overview.slice(0, maxOverviewLengthMobile) + '....'
            : isDesk
                ? data.overview.slice(0, maxOverviewLengthMobile) + '....'
                : data.overview.slice(0, maxOverviewLengthDesktop) + '....');

    return (
        <div className="relative w-full h-[35rem] overflow-hidden">
            <img
                loading="lazy"
                src={`https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${data.backdrop_path}&w=500&h=500&output=webp`}
                className="absolute top-0 left-0 brightness-50 w-full h-full object-cover z-10"
                alt="Backdrop"
            />
            <div className="w-full h-full absolute top-0 left-0 z-20"
                style={{ background: "radial-gradient(circle, transparent 0%, #191919 85%)" }}
            />
            <div className="w-full h-full absolute top-7 left-0 flex justify-start items-center z-30 px-4 md:px-8">
                <img
                    loading="lazy"
                    src={`https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${data.poster_path}&w=300&h=300&output=webp`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                    }}
                    className="w-64 rounded-md mr-7 md:hidden"
                    alt="Poster"
                />
                <div className="flex flex-col items-start w-2/3 md:w-full">
                    <h1 className="md:text-4xl sm:text-3xl text-5xl mb-3 text-white font-medium">
                        {data.title || data.name}{" "}
                        (<Link to={`/year/${date}`} style={{ color: 'red' }}>{date}</Link>)
                        Watch Online
                    </h1>
                    <div className="mb-1 flex items-start">
                        <h3 className="text-lightGray flex items-center relative mr-4 after:w-[2px] after:h-3/6 after:bg-gray after:absolute after:-right-2 after:top-1/2 after:translate-y-[-50%]">
                            <i className="fa-regular fa-star text-amber-500 mr-1"></i>
                            {`${Math.round(data.vote_average)}/10`}
                        </h3>
                        <h3 className="text-lightGray mr-4 relative after:w-[2px] after:h-3/6 after:bg-gray after:absolute after:-right-2 after:top-1/2 after:translate-y-[-50%]">
                            {genreName && <Link to={`/genres/${type}/${genreId}/1`} className="text-lightGray underline">{genreName}</Link>}
                        </h3>
                        <h3 className="text-lightGray">{convertedTime}</h3>
                    </div>
                    {truncatedOverview && (
                        <p className="text-white leading-7 md:text-base w-full md:w-10/12 mb-3">watch online : {truncatedOverview}</p>
                    )}

                    {keywords.length > 0 && (
                        <div className="md:w-full mb-3 flex flex-col sm:flex-row flex-wrap sm:items-center sm:justify-start">
                            <span className="text-red mb-2 sm:mb-0">Keywords: </span>
                            <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto space-x-2 sm:space-x-4">
                                {keywords.slice(0, 10).map((keyword, index) => (
                                    <span key={keyword.id} className="text-white flex-shrink-0">
                                        <Link to={`/keywords/${keyword.id}`} className="whitespace-nowrap">
                                            {keyword.name}
                                        </Link>
                                        {index < keywords.slice(0, 10).length - 1 && <span>,&nbsp;</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 grid-rows-1 w-2/3 md:w-full">
                        <div>
                            <h3 className="text-lightGray -mb-[2px]">
                            <Link to={`/casts/${director}`} style={{ color: 'red' }}>{director}
                            </Link>
                            </h3>
                            <h4 className="text-gray text-sm">Director</h4>
                        </div>
                        <div>
                            <h3 className="text-lightGray -mb-[2px]">
                            <Link to={`/year/${date}`} style={{ color: 'red' }}>{date}
                            </Link>
                            </h3>
                            <h4 className="text-gray text-sm">Year</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowHeader;