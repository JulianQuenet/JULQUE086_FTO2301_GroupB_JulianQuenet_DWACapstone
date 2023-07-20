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

  const slicedItem = items.slice(0, 13);
  const slides = slicedItem.map((preview, index) => {
    return <SwiperSlide key={index}>{preview}</SwiperSlide>;
  });

  return (
    <div className="carousel" style={{marginTop:"20px"}}>
      <div style={{color:"ThreeDDarkShadow", textAlign:"center"}}>You may also be interested in:</div>
      <Swiper
        effect={"coverflow"}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={6}
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
