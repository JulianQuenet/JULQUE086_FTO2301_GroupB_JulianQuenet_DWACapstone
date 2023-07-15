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

  const slicedItem = items.slice(0, 11);
  const slides = slicedItem.map((preview, index) => {
    return <SwiperSlide key={index}>{preview}</SwiperSlide>;
  });

  return (
    <div className="carousel">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={4}
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
