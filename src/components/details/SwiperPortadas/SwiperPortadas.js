import {  useState } from "react";
import './SwiperPortadas.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination,Navigation } from 'swiper/modules';

const DetailPortadas = ({data,changePort}) => {

    const [selected,setSelected] = useState();

    const changePortadas = (item,data)=>{
        setSelected(item)
        changePort(data)
    }


    return (
        <div className="inlineFlex detailCompPortadas">

            <Swiper
                slidesPerView={4}
                spaceBetween={20}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                0: {
                    slidesPerView: 2,
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
                className="inlineFlex detailCompPortadasSwiper"
            >
                {data.map((item,index)=>(
                    <SwiperSlide>
                        <div 
                            className={ selected === index  ? 'inlineFlex detailCompPortadasItem detailCompPortadasItemAct' : 'inlineFlex detailCompPortadasItem' }
                            onClick={()=>changePortadas(index,item)}
                        >
                            <img src={item.prodacf_ifportadas_limg} alt="" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
};

export default DetailPortadas;
