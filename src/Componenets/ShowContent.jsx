import { useEffect, useState, useMemo } from 'react';
import Cast from "./Cast";
import Recommendations from "./Recommendations";
import ShowActions from "./ShowActions";
import Series from "./Series";

function ShowContent({ id, type }) {
  const [meta, setMeta] = useState({
    title: '',
    description: '',
    releaseDate: '',
    image: '',
    directors: [],
    imdbId: ''
  });

  const [selectedUrl, setSelectedUrl] = useState('');

  // Fetch TMDB metadata
  useEffect(() => {
    const fetchMeta = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits,external_ids`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        const directors = data.credits?.crew?.filter(c => c.job === 'Director').map(d => d.name) || [];
        const imdbId = data.external_ids?.imdb_id || '';

        setMeta({
          title: data.title || data.name || 'Unknown Title',
          description: data.overview || 'No description available.',
          releaseDate: data.release_date || data.first_air_date || '',
          image: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '',
          directors,
          imdbId
        });
      } catch (error) {
        console.error('Failed to fetch TMDB metadata:', error);
      }
    };

    fetchMeta();
  }, [id, type]);

  const options = useMemo(() => [
    { text: "⭐ VidSrc", value: `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { text: "⭐ VidLink", value: `https://vidlink.pro/movie/${id}` },
    { text: "⭐ EmbedSu", value: `https://embed.su/embed/movie/${id}` },
    { text: "⭐ VidSrcCC", value: `https://vidsrc.cc/v2/embed/movie/385687${id}` },
    { text: "⭐ Pstream", value: `https://iframe.pstream.mov/media/tmdb-movie-${id}` },
    { text: "⭐ Videasy", value: `https://player.videasy.net/movie/${id}` },
    { text: "⭐ Vidfast", value: `https://vidfast.pro/movie/${id}` },
    { text: "⭐ Vidify", value: `https://vidify.top/embed/movie/${id}` },
    { text: "⭐ Letsembed", value: `https://letsembed.cc/embed/movie/?id=${id}` },
    { text: "⭐ Rivestream", value: `https://rivestream.org/embed?type=movie&id=${id}` },
    { text: "⭐ Vidora", value: `https://vidora.su/movie/${id}` },
    { text: "⭐ Vidzee", value: `https://player.vidzee.wtf/embed/movie/${id}` },
    { text: "⭐ verhdlink", value: meta.imdbId ? `https://verhdlink.cam/movie/${meta.imdbId}` : '' },
    { text: "⭐ Embed69", value: meta.imdbId ? `https://embed69.org/f/${meta.imdbId}` : '' },
    { text: "⭐ Meinecloud", value: meta.imdbId ? `https://meinecloud.click/movie/${meta.imdbId}` : '' },
    { text: "⭐ Frenchcloud", value: meta.imdbId ? `https://frenchcloud.cam/movie/${meta.imdbId}` : '' },
    { text: "⭐ Mostraguarda", value: meta.imdbId ? `https://mostraguarda.stream/movie/${meta.imdbId}` : '' },
    { text: "⭐ Frembed", value: `https://frembed.icu/api/film.php?id=${id}` }
  ].filter(opt => opt.value), [id, meta.imdbId]);

  useEffect(() => {
    if (options.length) setSelectedUrl(options[0].value);
  }, [options]);

  const directorSchema = meta.directors.length
    ? meta.directors.map(name => ({ "@type": "Person", name }))
    : undefined;

  return (
    <div>
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

      {type === 'movie' && (
        <div className="mx-4 my-5 md:mx-5 lg:mx-16 xl:mx-28 overflow-x-hidden">
          <ShowActions id={id} type={type} />

          <div className="sm:h-[18rem] w-full h-[28rem] flex justify-center mt-4 relative">
            {selectedUrl && (
              <iframe
                src={selectedUrl}
                className="sm:w-full w-3/4 h-full"
                frameBorder="0"
                allowFullScreen
                width="100%"
                height="100%"
              ></iframe>
            )}
          </div>

          <div className="flex flex-wrap gap-2 my-4 justify-center">
            {options.map((opt, index) => (
              <button
                key={index}
                onClick={() => setSelectedUrl(opt.value)}
                className={`px-3 py-2 text-sm sm:text-base rounded-lg font-semibold transition-all duration-200 shadow-md
                  ${selectedUrl === opt.value
                    ? 'bg-green-600 text-white animate-pulse-glow'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <div className="sharethis-inline-share-buttons"></div>
          <Cast type={type} id={id} />
          <Recommendations type={type} id={id} />
        </div>
      )}

      {type === 'tv' && (
        <div className="mx-4 my-5 md:mx-5 lg:mx-16 xl:mx-28 overflow-x-hidden">
          <ShowActions id={id} type={type} />
          <Series id={id} />
          <Cast type={type} id={id} />
          <Recommendations type={type} id={id} />
        </div>
      )}

      <style jsx>{`
        @keyframes glow {
          0% { box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #22c55e; }
          50% { box-shadow: 0 0 15px #22c55e, 0 0 25px #22c55e, 0 0 35px #22c55e; }
          100% { box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #22c55e; }
        }
        .animate-pulse-glow {
          animation: glow 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default ShowContent;
