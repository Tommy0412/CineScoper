import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectGenre } from "../RTK-Store/popularGenresReducer";
import ShowCard from "./ShowCard";

function PopularSlider() {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  const genre = useSelector(selectGenre);
  const [data, setData] = useState([]);
  const [type, setType] = useState();

  useEffect(() => {
    let url = "";

    if (genre === "movie") {
      url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`;
      setType("movie");
    } else if (genre === "tv") {
      url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${key}`;
      setType("tv");
    } else if (genre === "animation") {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${key}&include_adult=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=16`;
      setType("tv");
    } else {
      url = `https://api.themoviedb.org/3/trending/all/week?api_key=${key}`;
      setType("all");
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data.results))
      .catch((error) => console.error("Failed to fetch data:", error));
  }, [genre]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const touchStartX = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getIndex = () => {
    if (windowWidth < 475) return 1;
    if (windowWidth <= 725) return 2;
    if (windowWidth <= 1000) return 3;
    if (windowWidth <= 1225) return 4;
    if (windowWidth <= 1400) return 5;
    return 6;
  };

  useEffect(() => setActiveIndex(0), [data]);

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + (data.length - getIndex())) % (data.length - getIndex())
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % (data.length - getIndex()));
  };

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (deltaX > 5) handlePrev();
    else if (deltaX < -5) handleNext();
    touchStartX.current = null;
  };
  const handleTouchEnd = () => (touchStartX.current = null);

  const getValue = () => {
    if (windowWidth < 475) return (data.length / 4) * 10;
    if (windowWidth <= 725) return (data.length / 6) * 10;
    if (windowWidth <= 1000) return (data.length / 8) * 10;
    if (windowWidth <= 1225) return (data.length / 10) * 10;
    if (windowWidth <= 1400) return (data.length / 12) * 10;
    return (data.length / 14) * 10;
  };

  return (
    <div className="relative mt-4">
      <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="relative overflow-hidden">
        <div className="flex items-start" style={{ transform: `translateX(-${activeIndex * getValue()}%)` }}>
          {data.map((item, index) => (
            <ShowCard key={index} movie={item} index={index} value={getValue()} type={type} />
          ))}
        </div>
      </div>

      {/* Arrows for mobile */}
      <span className="md:hidden fa-solid fa-chevron-right text-3xl absolute top-1/2 -right-12 font-semibold text-gray p-2 cursor-pointer transform -translate-y-1/2" onClick={handleNext} />
      <span className="md:hidden fa-solid fa-chevron-left text-3xl absolute top-1/2 -left-12 font-semibold text-gray p-2 cursor-pointer transform -translate-y-1/2" onClick={handlePrev} />
    </div>
  );
}

export default PopularSlider;