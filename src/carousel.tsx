import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation} from '../node_modules/swiper'


import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";


interface Lists {
    item: JSX.Element[];
  }


export const Carousel = (props: Lists) => {
  const { item } = props;
  
  const slides = item.map((preview, index)=> {
    return (
      <SwiperSlide key={index}>{preview}</SwiperSlide>
  
    )
  })  

  return (
    <div className="carousel">
    <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 1,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          navigation={true}
        modules={[ EffectCoverflow, Pagination,Navigation]}
        className="mySwiper"
      >
   {slides}
  </Swiper>
  </div>
  );
};

export default Carousel;

