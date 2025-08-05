import { useState, useEffect } from "react";

function HeaderImages(props) {
    const { style, id } = props;
	const key = import.meta.env.VITE_TMDB_API_KEY;
    const [imgs, setImgs] = useState(null);
    const placeholder = '/placeholder.png';

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${key}`)
            .then(res => res.json())
            .then(data => {
                if (data.backdrops && data.backdrops.length > 1) {
                    setImgs(data.backdrops[1].file_path);
                } else {
                    setImgs(null);
                }
            })
            .catch(() => setImgs(null));  
    }, [id]);

    const imageSrc = imgs
        ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${imgs}&w=300&h=300&output=webp`
        : placeholder;

    return (
        <img 
            loading="lazy"
            src={imageSrc}
            className={`${style}`}
            width="300"
            height="300"
            alt="movie_poster"
        />
    );
}

export default HeaderImages;