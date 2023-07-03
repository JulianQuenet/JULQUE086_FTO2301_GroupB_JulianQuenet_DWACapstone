import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation} from '../node_modules/swiper'

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


const GENRES: string[] = [
    "Personal Growth",
    "True Crime and Investigative Journalism",
    "History",
    "Comedy",
    "Entertainment",
    "Business",
    "Fiction",
    "News",
    "Kids and Family",
  ];
  
  
const Genres = () => {
    
    const slides = GENRES.map((genre, index)=> {
        return (
          <SwiperSlide key={index} className="genre">{genre}</SwiperSlide>
        )
    })
    return (
        <Swiper
        slidesPerView={'auto'}
        spaceBetween={10}
        >
          {slides}  
        </Swiper>
    )
}


export default Genres;