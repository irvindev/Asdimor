import React, { useEffect, useState } from "react";
import './SwiperIntro.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

import homeIntro1 from '../../../assets/img/home_intro1.png';
import homeIntro2 from '../../../assets/img/home_intro2.png';
import homeIntro3 from '../../../assets/img/home_intro3.png';

import Skeleton from '@mui/material/Skeleton';

import axios from 'axios';

import { faker } from '@faker-js/faker';
import { useAuthContext } from './../../../context/authContext';
import { Link } from 'react-router';


const HomeSwiperIntro = ({data}) => {


    return (
        <div className="inlineFlex homeSwiperIntro">
            {data && data.length && data.length > 0 ?

                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={'auto'}
                    spaceBetween={0}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: -35,
                        stretch: 0,
                        depth: 150,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={false}
                    modules={[Autoplay,EffectCoverflow, Pagination]}
                    className="homeSwiperIntroComponent"
                >
                    {data.map((item,index)=>(
                        <SwiperSlide key={'homeIntroSwuper-'+faker.string.uuid()}>
                            {item.featuredImage &&
                                <Link to={'/tienda/'+item.slug}>
                                    <img src={item.featuredImage?.node?.sourceUrl} alt="" />
                                </Link>
                            }
                        </SwiperSlide>
                    ))}
                </Swiper>
            :
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={'auto'}
                    spaceBetween={0}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: -35,
                        stretch: 0,
                        depth: 150,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={false}
                    modules={[Autoplay,EffectCoverflow, Pagination]}
                    className="homeSwiperIntroComponent"
                >
                    <SwiperSlide className={'hsicSwiperLoad'} >
                        <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                        <img src={homeIntro1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide className={'hsicSwiperLoad'} >
                        <Skeleton variant="rounded" width={'100%'} height={'100%'} />
                        <img src={homeIntro1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide className={'hsicSwiperLoad'} >
                        <Skeleton variant="rounded" width={'100%'} height={60} />
                        <img src={homeIntro1} alt="" />
                    </SwiperSlide>
                </Swiper>
            }
        </div>
    )
};

export default HomeSwiperIntro;
