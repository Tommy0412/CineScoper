import { useEffect, useState } from 'react';
import Cast from "./Cast";
import Recommendations from "./Recommendations";
import ShowActions from "./ShowActions";
import Series from "./Series";

function ShowContent(props) {
  const { id, type } = props;
  const movie = `/movies.html?id=${id}`;
  const [meta, setMeta] = useState({
    title: '',
    description: '',
    releaseDate: '',
    image: '',
    directors: []
  });

  useEffect(() => {
    const fetchMeta = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        let directors = [];
        if (data.credits && data.credits.crew) {
          directors = data.credits.crew
            .filter(member => member.job === 'Director')
            .map(d => d.name);
        }

        setMeta({
          title: data.title || data.name || 'Unknown Title',
          description: data.overview || 'No description available.',
          releaseDate: data.release_date || data.first_air_date || '',
          image: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : '',
          directors
        });
      } catch (error) {
        console.error('Failed to fetch TMDB metadata:', error);
      }
    };

    fetchMeta();
  }, [id, type]);

  const directorSchema = meta.directors.length
    ? meta.directors.map(name => ({ "@type": "Person", name }))
    : undefined;

  return (
    <div>
      {/* Inject Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "movie" ? "Movie" : "TVSeries",
            "name": meta.title,
            "description": meta.description,
            "datePublished": meta.releaseDate,
            "image": meta.image || undefined,
            "director": directorSchema,
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "potentialAction": {
              "@type": "WatchAction",
              "target": typeof window !== 'undefined' ? window.location.href : '',
              "expectsAcceptanceOf": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          })
        }}
      ></script>

      {/* Movie layout */}
      {type === 'movie' && (
        <div className="mx-28 my-5 md:mx-5 lg:mx-16">
          <ShowActions id={id} type={type} />
          <div className="w-full">
            <div className="relative py-3 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
              <h2 className="text-xl font-semibold">
                <i className="fa-solid fa-film mr-2"></i>Watch Online
              </h2>
            </div>
            <div className="sm:h-[18rem] w-full h-[28rem] flex justify-center mt-4 relative">
              <iframe
                src={movie}
                className="sm:w-full w-3/4 h-full cursor-pointer"
                loading="lazy"
                frameBorder="0"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
              ></iframe>
            </div>
            <div className="sharethis-inline-share-buttons"></div>
          </div>
          <Cast type={type} id={id} />
          <Recommendations type={type} id={id} />
        </div>
      )}

      {/* TV layout */}
      {type === 'tv' && (
        <div className="mx-28 my-5 md:mx-5 lg:mx-16">
          <ShowActions id={id} type={type} />
          <Series id={id} />
          <Cast type={type} id={id} />
          <Recommendations type={type} id={id} />
        </div>
      )}
    </div>
  );
}

export default ShowContent;