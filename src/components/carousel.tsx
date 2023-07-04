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
  item: JSX.Element[];
}

export const Carousel = (props: Lists) => {
  const { item } = props;

  const slides = item.map((preview, index) => {
    return <SwiperSlide key={index}>{preview}</SwiperSlide>;
  });

  return (
    <div className="carousel">
      <h3>All shows:</h3>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        initialSlide={3}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 5,
          stretch: -50,
          depth: 350,
          modifier: 1,
          scale: 0.85,
        }}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides}
      </Swiper>
    </div>
  );
};

export default Carousel;
