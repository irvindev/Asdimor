import './AnunciosTop.scss';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation,Autoplay } from 'swiper/modules';

const AnunciosTop = ({data}) => {
  return (
    <div className="inlineFlex anunciosTopCom">
      <Swiper
          autoHeight={true}
          spaceBetween={0}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay,Navigation]}
          className="anunciosTopComSwiper"
      >
        
        {data && data.length && data.length > 0 && data.map((item)=>(
          <SwiperSlide>
            <div className="inlineFlex anunciosTopComItem">
              <div dangerouslySetInnerHTML={{__html: item.confAnunTxt}}></div>
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>
    </div>
  )
};

export default AnunciosTop;
