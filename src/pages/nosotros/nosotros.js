import {useState,useEffect} from "react";
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';

import './nosotros.scss';

import nosotrosImg from './../../assets/img/nosotros_img.png';
import nosotrosDetBottom from './../../assets/img/nosotros_det_bottom.png';

import nosotrosTeam from './../../assets/img/nosotros_team.png';
import nosotrosMision from './../../assets/img/nosotros_mision.png';

import nosotrosValores1 from './../../assets/img/nosotros_ico_valores1.png';

import nosotrosValoresBack from './../../assets/img/nosotros_valores_back.png';

import Container from '@mui/material/Container';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

const NosotrosPage = (props) => {

  const {baseUrl} = useAuthContext();

  const [infoPage,setInfoPage] = useState();
  const getInfoPage = ()=>{
    axios.get(baseUrl+'wp-json/wp/v2/pages/498')
      .then((resp)=>{
        console.log(resp.data.acf)
        console.log('==>',resp.data.acf.pnos_intro_img)
        setInfoPage(resp.data.acf);
      }).catch((error)=>{
        console.log(error)
      })
  }

  useEffect(()=>{
    getInfoPage();
  },[])


  return (
    <LayoutPages classComp={'nosotrosPageCont'}>
        <LayoutCont keyPage={'nosotrosPage'}>
          <section className="secBox inlineFlex nospIntro">
            <div className="nospIntroFloat">
              <Container>
                {infoPage && infoPage.pnos_intro_txt ?
                  <div className="txt" dangerouslySetInnerHTML={{__html: infoPage.pnos_intro_txt}}></div>
                :
                  <div className="txt"></div>
                }
              </Container>
            </div>
            <figure>
              {infoPage && infoPage.pnos_intro_img &&
                <img src={infoPage.pnos_intro_img} alt="" />
              }
              {false &&
                <img src={nosotrosImg} alt="" />
              }
            </figure>
            <div className="nospIntroDet">
              <img src={nosotrosDetBottom} alt="" />
            </div>
          </section>
          <section className="secBox nospMision">
            <Container>
              <div className="nospMisionBox">
                <figure>
                  {infoPage && infoPage.pnos_myv_img ? 
                    <img src={infoPage.pnos_myv_img} alt="" />
                  :
                    <img src={nosotrosTeam} alt="" />
                  }
                </figure>
                {infoPage && infoPage.pnos_myv_list && infoPage.pnos_myv_list.length > 0 &&
                  <ul>
                    {infoPage.pnos_myv_list.map((item)=>(

                      <li className={'inlineFlex'}>
                        {item.pnos_myv_limg ? 
                          <img src={item.pnos_myv_limg} alt="" />
                        :
                          <img src={nosotrosMision} alt="" />
                        }
                        {item.pnos_myv_ltxt &&
                        <div className="txt" dangerouslySetInnerHTML={{__html: item.pnos_myv_ltxt}}></div>
                        }
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </Container>
          </section>
          <section className="secBox nospCounter">
            <div className="nospCounterDet nospCounterDet1">
              <img src={nosotrosDetBottom} alt="" />
            </div>
            <Container>
              <div className="nospCounterBox">
                {infoPage && infoPage.pnos_cont_lista && infoPage.pnos_cont_lista.length > 0 &&
                  <ul>
                    {infoPage.pnos_cont_lista.map((item)=>(
                      <li>
                        <h5 dangerouslySetInnerHTML={{__html: item.pnos_cont_lnum}}></h5>
                        <p dangerouslySetInnerHTML={{__html: item.pnos_cont_lnom}}></p>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </Container>
            <div className="nospCounterDet nospCounterDet2">
              <img src={nosotrosDetBottom} alt="" />
            </div>
          </section>
          <section className="secBox nospValores">
            <Container>
              <div className="nospValoresBox">
                <h4>Nuestros valores</h4>
                {infoPage && infoPage.pnos_val_list && infoPage.pnos_val_list.length > 0 &&
                  <ul>
                    {infoPage.pnos_val_list.map((item)=>(
                      <li>
                        <figure>
                          {item.pnos_val_lico ? 
                            <img src={item.pnos_val_lico} alt="" />
                          :
                            <img src={nosotrosValores1} alt="" />
                          }
                        </figure>
                        <p>{item.pnos_val_ltxt ? item.pnos_val_ltxt :'--'}</p>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </Container>
            <div className="inlineFlex nospValoresBack">
              <img src={nosotrosValoresBack} alt="" />
            </div>
          </section>
        </LayoutCont>
    </LayoutPages>
  )
};

export default NosotrosPage;
