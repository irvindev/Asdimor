
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import { Link } from "react-router";

// import required modules
import { Autoplay,Pagination } from 'swiper/modules';

import './SwiperPub.scss';

const SwiperPub = ({data}) => {
  return (
    <div className="inlineBlock homeSwiperPubBox">
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          5400: {
            slidesPerView: 1,
          },
        }}
        modules={[Autoplay,Pagination]}
        className="homeSwiperPub"
      >
        {data.map((item)=>(
            <SwiperSlide>
              {item.hsecPubLtxt !== '' ?
                <Link to={item.hsec_pub_ltxt} className="inlineFlex homeSwiperPubItem">
                    <img src={item.hsecPubLimg?.node?.sourceUrl} alt="" />
                </Link>
              :
                <div className="inlineFlex homeSwiperPubItem">
                    <img src={item.hsecPubLimg?.node?.sourceUrl} alt="" />
                </div>
              }

            </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
};

export default SwiperPub;

