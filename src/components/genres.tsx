import React from "react";
import one from "../assets/backgrounds-genre/1.png";
import two from "../assets/backgrounds-genre/2.png";
import three from "../assets/backgrounds-genre/3.png";
import four from "../assets/backgrounds-genre/4.png";
import five from "../assets/backgrounds-genre/5.png";
import six from "../assets/backgrounds-genre/6.png";
import seven from "../assets/backgrounds-genre/7.png";
import eight from "../assets/backgrounds-genre/8.png";
import nine from "../assets/backgrounds-genre/9.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "../../node_modules/swiper";

import "swiper/css";
import "swiper/css/pagination";

export const GENRES: string[] = [
  "Entertainment",
  "Comedy",
  "True Crime and Investigative Journalism",
  "Kids and Family",
  "History",
  "Personal Growth",
  "News",
  "Business",
  "Fiction",
];

const images: { [key: number]: any } = {
  1: one,
  2: two,
  3: three,
  4: four,
  5: five,
  6: six,
  7: seven,
  8: eight,
  9: nine,
};

interface genreProps {
  toggle: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Genres = (props: genreProps) => {
  const { toggle } = props;

  const getStyles = (index: number) => {
    const styles = GENRES.map((item, index) => {
      if (!item) return;
      return {
        background: `url(${images[index + 1]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      };
    });
    return styles[index];
  };

  const titleStyles: React.CSSProperties = {
    width: "100%",
    height: "50%",
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    color: "darkkhaki",
  };

  const slides = GENRES.map((genre, index) => {
    return (
      <SwiperSlide
        key={index}
        className="genre"
        onClick={toggle}
        id={genre}
        style={getStyles(index)}
      >
        <div style={titleStyles}>{genre}</div>
      </SwiperSlide>
    );
  });

  return (
    <div className="genre-section">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={10}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        {slides}
      </Swiper>
    </div>
  );
};

export default Genres;
