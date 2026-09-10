import { useEffect,useState } from "react";
import './SwiperGallery.scss';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination,Navigation,Mousewheel } from 'swiper/modules';

import { faker } from '@faker-js/faker';
import useFancybox from './useFancybox';


const DetailGallery = ({data}) => {

    const [ imageFeatured, setImageFeatured ] = useState();

    const [fancyboxRef] = useFancybox();

    const changeImage = (img) =>{
        setImageFeatured(img)
    }

    useEffect(()=>{
        setImageFeatured(data[0].src);
        let tmpList = [];
        data.map((item)=>{
            tmpList.push(item.src)
        });
    },[])


    return (
        <div ref={fancyboxRef} className="detallePageGaleriaBox">
            <div className="list">
                <Swiper
                    direction={'vertical'}
                    pagination={false}
                    navigation={true}
                    slidesPerView={3}
                    mousewheel={true}
                    breakpoints={{
                        '0': {
                            direction:'horizontal',
                            slidesPerView:3,
                            spaceBetween:10
                        },
                        '900': {
                            direction:'horizontal',
                            slidesPerView:4,
                            spaceBetween:20
                        },
                        '1050': {
                            direction:'vertical'
                        },
                        '50000': {
                            direction:'vertical'
                        },
                    }}
                    modules={[Mousewheel,Pagination,Navigation]}
                    className="detailGallery"
                >
                    {data && data.length && data.length > 0 && data.map((item)=>(
                        <SwiperSlide  onClick={()=>changeImage(item.src)} className="item" key={'detGal'+faker.string.uuid()}>
                            <img  src={item.src} alt="" />
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
            
            <figure data-fancybox="gallery" href={imageFeatured}>
                <img src={imageFeatured} />
            </figure>
        </div>
    )
};

export default DetailGallery;
