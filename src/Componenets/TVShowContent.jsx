import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSort } from "../RTK-Store/sortReducer";
import { selectPage } from "../RTK-Store/pageReducer";
import ShowCard from "./ShowCard";

function TVShowSlider() {
    const [data, setData] = useState([]);
    const sort = useSelector(selectSort);
    const page = useSelector(selectPage);
    const key = import.meta.env.VITE_TMDB_API_KEY;
	const siteName = import.meta.env.VITE_SITE_NAME;

    useEffect(() => {
        let url = "";
        let title = "";

        if (sort === 'popular') {
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${key}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=vote_average.desc&vote_count.gte=500&without_genres=16`;
			title = `${siteName} - Popular TV Shows Watch Online`;
        } else if (sort === 'top_rated') {
            url = `https://api.themoviedb.org/3/discover/tv?api_key=${key}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=vote_count.desc&without_genres=16`;
			title = `${siteName} - Top Rated TV Shows Watch Online`;
        } else if (sort === 'now_playing') {
            url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${key}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&without_genres=16`;
			title = `${siteName} - Now Playing TV Shows Watch Online`;
        }

        if (url) {
            fetch(url)
                .then((res) => res.json())
                .then((data) => setData(data.results || []));
            document.title = title;
        }

        window.scrollTo(0,0);
    }, [sort, page, key]);

    return (
        <div className="my-4 grid grid-cols-7 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.map((movie, index) => (
                <ShowCard key={index} movie={movie} index={index} value={0} type={'tv'} />
            ))}
        </div>
    )
}

export default TVShowSlider;
