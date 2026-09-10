import {useState} from "react";
import './SwiperVolantes.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination,Navigation } from 'swiper/modules';

const DetailVolantes = ({data,changeVol}) => {

    const [selected,setSelected] = useState();

    const changeVolantes = (item,data)=>{
        setSelected(item)
        changeVol(data)
    }


    return (
        <div className="inlineFlex detailCompVolantes">

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
                className="inlineFlex detailCompVolantesSwiper"
            >
                {data.map((item,index)=>(
                    <SwiperSlide>
                        <div
                            className={ selected === index  ? 'inlineFlex detailCompVolantesItem detailCompVolantesItemAct' : 'inlineFlex detailCompVolantesItem' }
                            onClick={()=>changeVolantes(index,item)}
                        >
                            <img src={item.prodacf_vol_img} alt="" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
};

export default DetailVolantes;
