
import React from "react";
import './SwiperProducts.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination,Navigation } from 'swiper/modules';
import ProductItem from '../../Cart/ProductItem/ProductItem';


const SwiperProducts = ({data}) => {
  return (
    <div className="inlineBlock homeSwiperProductsBox">
      <Swiper
        slidesPerView={4}
        spaceBetween={20}
        navigation={true}
        //pagination={{
          //clickable: true,
        //}}
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
        className="homeSwiperProducts"
      >
        {data.map((item)=>(
          <SwiperSlide>
            <ProductItem data={item}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
};

export default SwiperProducts;
