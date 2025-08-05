import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ShowHeader from './ShowHeader';
import Cast from './Cast';
import Recommendations from './Recommendations';

function WatchEp() {
  const { id, type, season, episode } = useParams();
  const [totalEpisodes, setTotalEpisodes] = useState(null);
  const [showData, setShowData] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);

  const currentEpisode = parseInt(episode, 10);
  const ep = `/tv.html?id=${id}&season=${season}&episode=${currentEpisode}`;
  const currentUrl = window.location.href;
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780'; // or choose size like w500

  useEffect(() => {
	const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    const fetchShowDetails = async () => {
      try {
        const showRes = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`);
        const showJson = await showRes.json();
        setShowData(showJson);

        const episodeRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${currentEpisode}?api_key=${apiKey}&language=en-US&append_to_response=credits`);
        const episodeJson = await episodeRes.json();
        setEpisodeData(episodeJson);

        const showName = showJson.name || 'TV Show';
        document.title = `Watch ${showName} - Season ${season} Episode ${currentEpisode}`;

        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.rel = 'canonical';
          document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = currentUrl;

        let directors = [];
        if (episodeJson.credits && episodeJson.credits.crew) {
          directors = episodeJson.credits.crew.filter(member => member.job === 'Director');
        }

        const schema = {
          "@context": "https://schema.org",
          "@type": "TVEpisode",
          "name": episodeJson.name || `${showName} - S${season}E${currentEpisode}`,
          "episodeNumber": currentEpisode,
          "seasonNumber": parseInt(season),
          "description": episodeJson.overview || showJson.overview || "",
          "image": episodeJson.still_path ? TMDB_IMAGE_BASE + episodeJson.still_path : undefined,
          "director": directors.length > 0
            ? directors.map(d => ({
                "@type": "Person",
                "name": d.name
              }))
            : undefined,
          "partOfSeries": {
            "@type": "TVSeries",
            "name": showName
          },
          "datePublished": episodeJson.air_date || "",
          "url": currentUrl,
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
        };

        Object.keys(schema).forEach(key => {
          if (schema[key] === undefined) delete schema[key];
        });

        let scriptTag = document.getElementById('schema-episode');
        if (scriptTag) scriptTag.remove();

        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'schema-episode';
        scriptTag.textContent = JSON.stringify(schema);
        document.head.appendChild(scriptTag);

      } catch (error) {
        console.error('Error fetching show or episode details:', error);
      }
    };

    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        setTotalEpisodes(data.episodes.length);
      } catch (error) {
        console.error('Error fetching episode data:', error);
      }
    };

    fetchShowDetails();
    fetchEpisodes();
  }, [id, season, currentEpisode]);

  const previousEpisodeURL =
    currentEpisode > 1 ? `/show/tv/${id}/s/${season}/e/${currentEpisode - 1}` : null;

  const nextEpisodeURL =
    totalEpisodes && currentEpisode < totalEpisodes
      ? `/show/tv/${id}/s/${season}/e/${currentEpisode + 1}`
      : null;

  const allEpisodesURL = `/show/tv/${id}`;

  return (
    <>
      <ShowHeader id={id} type={'tv'} />
      <div className="mx-28 my-5 md:mx-5 lg:mx-16">
        <div className="w-full">
          <div className="relative py-3 flex items-end justify-between text-white after:w-full after:h-[2px] after:bg-[#ffffff2f] after:absolute after:bottom-0 after:left-1/2 after:translate-x-[-50%]">
            <h2 className="text-xl font-semibold">
              Watch Season {season} Episode {currentEpisode} Online
            </h2>
          </div>
          <div className="sm:h-[18rem] w-full h-[28rem] flex justify-center mt-4 relative">
            <iframe
              src={ep}
              className="sm:w-full w-3/4 h-full"
              frameBorder="0"
              allowFullScreen={true}
              width="100%"
              height="100%"
            ></iframe>
          </div>

          <div className="flex justify-between my-4">
            {previousEpisodeURL ? (
              <Link to={previousEpisodeURL} className="px-4 py-2 bg-blue-500 text-white rounded">
                ← Previous Episode
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed">
                ← Previous Episode
              </span>
            )}
            {nextEpisodeURL ? (
              <Link to={nextEpisodeURL} className="px-4 py-2 bg-blue-500 text-white rounded">
                Next Episode →
              </Link>
            ) : (
              <span className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed">
                Next Episode →
              </span>
            )}
          </div>

          <div className="flex justify-center my-4">
            <Link to={allEpisodesURL} className="px-4 py-2 bg-green-500 text-white rounded">
              Episodes
            </Link>
          </div>
        </div>
        <Cast type={'tv'} id={id} />
        <Recommendations type={'tv'} id={id} />
      </div>
    </>
  );
}

export default WatchEp;