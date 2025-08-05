import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';

function Cast(props) {
    const [cast, setCast] = useState([]);
    const { type, id } = props;
	const key = import.meta.env.VITE_TMDB_API_KEY;
    const placeholderImage = "/placeholder.png";

    const defaultCast = [
        { id: 1, name: "Unknown Actor", character: "Unknown Character", profile_path: null },
        { id: 2, name: "Unknown Actor", character: "Unknown Character", profile_path: null }
    ];

    useEffect(() => {
        const fetchCast = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${key}&language=en-US`);
                const data = await response.json();
                setCast(data.cast && data.cast.length > 0 ? data.cast : defaultCast);
            } catch (error) {
                console.error('Error fetching cast:', error);
                setCast(defaultCast);
            }
        };

        fetchCast();
    }, [id, type, key]);

    return (
        <div className="w-full mt-5">
            <div className="relative py-3 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
                <h2 className="text-xl font-semibold"><i className="fa-solid fa-user-group mr-2"></i>Casts</h2>
            </div>
            <div id="id" className="w-full mt-4 flex relative overflow-x-scroll snap-x">
                {cast.map((e) => (
                    <div key={e.id} className="p-2 pt-0 min-w-[144px] snap-center">
                        <Link to={`/casts/${e.name}`}>
                            <img
                                loading="lazy"
                                className="rounded-md w-32"
                                src={e.profile_path ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/original/${e.profile_path}&w=300&h=300&output=webp` : placeholderImage}
                                alt={e.name}
                            />
                        </Link>
                        <h3 className="text-white mt-2">{e.name}</h3>
                        <h4 className="text-gray">{e.character}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cast;