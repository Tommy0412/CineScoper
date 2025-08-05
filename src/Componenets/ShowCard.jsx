import { useState } from "react";
import { Link } from "react-router-dom";

function ShowCard(props) {
  const { movie, index, value, type } = props;
  const [hover, setHover] = useState(true);
  const link = `/show/${type}/${movie.id}`;
  const placeholderImage = '/placeholder.png';
  const imageUrl = movie.poster_path ? `https://wsrv.nl/?url=https://image.tmdb.org/t/p/original${movie.poster_path}&w=300&h=400&output=webp` : placeholderImage;

  return (
    <div
      key={index}
      className="relative flex flex-col items-start p-2 text-left"
      style={{ flex: `0 0 ${value}%` }}
    >
      <Link
        to={link}
        state={{ id: movie.id, type }}
        className={`fa-solid fa-play z-30 cursor-pointer text-red ${hover ? 'opacity-100' : 'opacity-0'} text-4xl absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-[41%]`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      <div className="overflow-hidden w-full">
        <img
          loading="lazy"
          className={`rounded-md w-full aspect-[2/3] object-cover transition-transform duration-300 ${hover ? 'scale-110 brightness-50' : 'scale-100 brightness-100'}`}
          src={imageUrl}
          width="300"
          height="400"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          alt="image_poster"
        />
      </div>
      <Link to={link} state={{ id: movie.id, type }} className="text-white mt-2">
  {movie.title
    ? movie.title.length < 25
      ? movie.title
      : movie.title.slice(0, 25) + '...'
    : movie.name
      ? movie.name.length < 25
        ? movie.name
        : movie.name.slice(0, 25) + '...'
      : 'No Title'}
</Link>
      <h3 className="text-gray">
        {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}
      </h3>
    </div>
  );
}

export default ShowCard;