import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
} from "../../node_modules/swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation"; 

interface Lists {
  items: JSX.Element[];
}

export const Carousel = (props: Lists) => {
  const { items } = props;

  const slicedItem = items.slice(0, 13); // Got 13 slides to show random items that user may be interested in
  const slides = slicedItem.map((preview, index) => { // Map through the sliced items and return a slide for each
    return <SwiperSlide key={index}>{preview}</SwiperSlide>;
  });

  return (
    <div className="carousel" style={{marginTop:"20px"}}>
      <div style={{color:"ThreeDDarkShadow", textAlign:"center"}}>You may also be interested in:</div>
      <Swiper // Swiper is a carousel library, this will hold the slides, nothing too fancy 
        effect={"coverflow"}
        centeredSlides={true} // Center the slides
        slidesPerView={"auto"} // Automatically adjust the number of slides to show based on the screen size
        initialSlide={6} // Start at the middle slide to show the user more options
        coverflowEffect={{
          rotate: 5,
          stretch: -50,
          depth: 350,
          modifier: 1,
          scale: 0.85,
        }}
        pagination={{ dynamicBullets: true, clickable: true }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="carouselSwiper"
      >
        {slides}
      </Swiper>
    </div>
  );
};

export default Carousel;
