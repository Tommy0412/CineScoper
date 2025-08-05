import ShowHeader from "./ShowHeader";
import ShowContent from "./ShowContent";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Show() {
	const location = useLocation();
	const { id, type } = useParams();
    const urll = window.location.href;

	const key = import.meta.env.VITE_TMDB_API_KEY;
    const [data, setData] = useState(null); 
    const [isAvailable, setIsAvailable] = useState(true); 
    const [showNagScreen, setShowNagScreen] = useState(false); 

    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const url = type === "tv" 
                    ? 'https://vidsrc.me/ids/tv_tmdb.txt' 
                    : 'https://vidsrc.me/ids/mov_tmdb.txt';

                const response = await fetch(url);
                const text = await response.text();
                const ids = text.split('\n').map(line => line.trim());

                if (!ids.includes(id)) {
                    setIsAvailable(false); 
                    setShowNagScreen(true);
                }
            } catch (error) {
                console.error('Error checking availability:', error);
            }
        };

        checkAvailability();
    }, [type, id]); 

    useEffect(() => {
        if (isAvailable && id) {
            const fetchData = async () => {
                try {
                    const response = type === "tv"
                        ? await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${key}&language=en-US`)
                        : await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`);

                    const data = await response.json();
                    setData(data);

                    if (type === "tv") {
                        document.title = `${data.name} Watch Online`;
                        document.querySelector('meta[name="description"]').setAttribute('content', data.overview);
                        document.querySelector('link[rel="canonical"]').setAttribute('href', urll);
                    } else if (type === "movie") {
                        document.title = `${data.title} Watch Online`;
                        document.querySelector('meta[name="description"]').setAttribute('content', data.overview);
                        document.querySelector('link[rel="canonical"]').setAttribute('href', urll);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [isAvailable, id, type, urll]); 

    if (!isAvailable && showNagScreen) {
        return (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.8)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ color: "yellow", fontSize: "24px", textAlign: "center" }}>
                    THIS CONTENT NOT AVAILABLE TO WATCH!
                    <button onClick={() => setShowNagScreen(false)} style={{ display: "block", marginTop: "20px", padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px" }}>
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div>Loading...</div>; 
    }

    return (
        <>
            <ShowHeader id={id} type={type} />
            <ShowContent type={type} id={id} />
        </>
    );
}

export default Show;