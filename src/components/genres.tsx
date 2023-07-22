import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
} from "../../node_modules/swiper";

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

interface genreProps {
  toggle: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Genres = (props: genreProps) => {
  const { toggle } = props;

  const getStyles = (index: number) => {
    const styles = GENRES.map((item, index) => {
      if(!item) return;
      return {
        background: `url(./src/assets/backgrounds-genre/${index + 1}.png)`,
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
  }

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
      <Swiper slidesPerView={"auto"} spaceBetween={10}
      navigation={true}
      modules={[Pagination, Navigation]}
      >
        {slides}
      </Swiper>
    </div>
  );
};

export default Genres;
