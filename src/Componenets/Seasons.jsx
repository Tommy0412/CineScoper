import Cast from "./Cast";
import Recommendations from "./Recommendations";
import { Link, useLocation, useParams } from "react-router-dom";
import ShowHeader from "./ShowHeader";
import { useEffect, useState } from "react";

const placeholderImage = "/placeholder.png";

function Seasons() {
    const location = useLocation();
	const { id, season } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [tvShowData, setTvShowData] = useState(null);

	const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    useEffect(() => {
        const fetchSeasonAndShowData = async () => {
            try {
                const seasonResponse = await fetch(
                    `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}`
                );
                const seasonData = await seasonResponse.json();
                setEpisodes(seasonData.episodes);

                const showResponse = await fetch(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
                );
                const showData = await showResponse.json();
                setTvShowData(showData);

                document.title = `${showData.name} - Season ${season} Watch Online`;
                document
                    .querySelector('meta[name="description"]')
                    ?.setAttribute(
                        "content",
                        `Watch ${showData.name} Season ${season} online. ${seasonData.overview || ""}`
                    );
                document
                    .querySelector('link[rel="canonical"]')
                    ?.setAttribute("href", window.location.href);
            } catch (error) {
                console.error("Error fetching season or show data:", error);
            }
        };

        fetchSeasonAndShowData();
    }, [id, season]);

    return (
        <>
            <ShowHeader id={id} type="tv" />
            <div className="mx-28 my-5 md:mx-5 lg:mx-16">
                <div className="w-full">
                    <div className="relative py-3 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
                        <h2 className="text-xl font-semibold">
                            <i className="fa-solid fa-film mr-2"></i>{`Season ${season}`}
                        </h2>
                    </div>
                    <div className="my-4 grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2">
                        {episodes.map((episode, index) => (
                            <div key={index} className="grid grid-cols-[9.6rem_1fr]">
                                <Link
                                    to={`/show/tv/${id}/s/${season}/e/${episode.episode_number}`}
                                    state={{ id: id, season: season, episode: episode.episode_number }}
                                    className="w-36 h-24"
                                >
                                    <img
                                        loading="lazy"
                                        className="rounded-md w-36 h-24 object-cover object-center cursor-pointer"
                                        src={
                                            episode.still_path
                                                ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${episode.still_path}&w=300&h=300&output=webp`
                                                : placeholderImage
                                        }
                                        alt={episode.name || "episode_image"}
                                        onError={(e) => {
                                            e.target.src = placeholderImage;
                                        }}
                                    />
                                </Link>
                                <div>
                                    <Link
                                        to={`/show/tv/${id}/s/${season}/e/${episode.episode_number}`}
                                        state={{ id: id, season: season, episode: episode.episode_number }}
                                        className="text-white cursor-pointer"
                                    >
                                        {`Episode ${episode.episode_number}`}
                                    </Link>
                                    <h2 className="text-lightGray text-sm mt-[2px]">{episode.name}</h2>
                                    <div className="mt-1 flex flex-wrap items-start justify-start">
                                        <h3 className="text-xs text-gray flex items-center relative mr-4 after:w-[2px] after:h-3/6 after:bg-gray after:absolute after:-right-2 after:top-1/2 after:translate-y-[-50%]">
                                            <i className="fa-regular fa-star text-amber-500 mr-1"></i>
                                            {`${Math.round(episode.vote_average)}/10`}
                                        </h3>
                                        <h3 className="text-xs text-gray mr-4 relative after:w-[2px] after:h-3/6 after:bg-gray after:absolute after:-right-2 after:top-1/2 after:translate-y-[-50%]">
                                            {episode.air_date && episode.air_date.slice(0, 4)}
                                        </h3>
                                        <h3 className="text-xs text-gray">{episode.runtime}m</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Cast type="tv" id={id} />
                <Recommendations type="tv" id={id} />
            </div>
        </>
    );
}

export default Seasons;