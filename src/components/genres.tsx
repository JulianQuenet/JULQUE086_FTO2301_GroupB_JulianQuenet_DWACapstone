import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Navigation,
} from "../../node_modules/swiper";

import "swiper/css";
import "swiper/css/pagination";

const GENRES: string[] = [
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
      return {
        background: `url(../../meta/backgrounds-genre/${index + 1}.png)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      };
    });
    console.log(styles[index]);
    return styles[index];
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
        {genre}
      </SwiperSlide>
    );
  });

  return (
    <div className="genre-section">
      <p className="genres-header">Genres</p>
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
