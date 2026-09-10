import { useEffect, useState } from 'react';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import icoFb from '../../../assets/img/ico_fb_2.png';
import icoWhatsapp from '../../../assets/img/ico_whatsapp.png';
import icoIg from '../../../assets/img/ico_twitter.png';

import './Social.scss';


const DetailSharedSocial = ({data,title}) => {

  const urlTmp = process.env.REACT_APP_SITE_URL;
  
  const [slugData,setSlugData] = useState();
  const [titleData,setTitleData] = useState();

  useEffect(()=>{
    setTitleData(title);
    setSlugData(data)
  },[data])

  return (
    <div className="inlineFlex detalleShareBox">
      <div className="inlineFlex detalleShare">
          <p>Compartir en:</p>
          
          <FacebookShareButton url={data ? urlTmp + '/tienda/' + slugData : urlTmp} title={titleData ? titleData : '--' }>
            <div dataTest={data ? urlTmp + '/tienda/' + slugData : urlTmp} className="inlineFlex detalleShareItem">
              <img src={icoFb} alt="" />
            </div>
          </FacebookShareButton>

          <WhatsappShareButton url={data ? urlTmp + '/tienda/' + slugData : urlTmp} title={titleData ? titleData : '--' }>
            <div className="inlineFlex detalleShareItem">
              <img src={icoWhatsapp} alt="" />
            </div>
          </WhatsappShareButton>
          <TwitterShareButton url={data ? urlTmp + '/tienda/' + slugData : urlTmp} title={titleData ? titleData : '--' }>
            <div className="inlineFlex detalleShareItem">
              <img src={icoIg} alt="" />
            </div>
          </TwitterShareButton>
          
      </div>
    </div>
  )
};

export default DetailSharedSocial;
