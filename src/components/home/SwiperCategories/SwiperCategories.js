
import './SwiperCategories.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext } from "react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// import required modules
import { Pagination,Navigation } from 'swiper/modules';
import { Link } from 'react-router';

const SwiperHomeCategories = ({data}) => {
  return (
    <div className="inlineBlock homeSwiperCategoriesBox">
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          450: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          1050: {
            slidesPerView: 4,
            spaceBetween:10
          },
          1300: {
            slidesPerView: 5,
          },
          5400: {
            slidesPerView: 5,
          },
        }}
        modules={[Pagination,Navigation]}
        className="homeSwiperCategories"
      >
        {data.map((item)=>(
          <SwiperSlide>
            
            <Link 
              className="homeSwiperCategoriesItem"
              to={`/tienda`}
              state={{ categoryId: item.databaseId }}
            >
              {item.image &&
              <figure>
                <img src={item.image?.sourceUrl} />
              </figure>
              }
              <h4>{item.name} <KeyboardArrowRightIcon /></h4>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
};

export default SwiperHomeCategories;
