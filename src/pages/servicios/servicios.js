import {useState,useEffect} from "react";
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';

import './servicios.scss';

import nosotrosImg from './../../assets/img/servicios_img.png';
import nosotrosDetBottom from './../../assets/img/nosotros_det_bottom.png';

import nosotrosValoresBack from './../../assets/img/nosotros_valores_back.png';

import Container from '@mui/material/Container';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

import Modal from '@mui/material/Modal';
import ServFormPreprensa from './../../components/servicios/preprensa';
import ServFormPrensa from './../../components/servicios/prensa';
import ServFormPostPrensa from './../../components/servicios/postprensa';

const ServiciosPage = (props) => {

  const {baseUrl} = useAuthContext();

  const [showForm,setShowForm] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = (indx) => {
    setShowForm(indx);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [infoPage,setInfoPage] = useState();
  const getInfoPage = ()=>{
    axios.get(baseUrl+'wp-json/wp/v2/pages/537')
      .then((resp)=>{
        setInfoPage(resp.data.acf);
      }).catch((error)=>{
        console.log(error)
      })
  }

  useEffect(()=>{
    getInfoPage();
  },[])

  return (
    <LayoutPages classComp={'serviciosPageCont'}>
        <LayoutCont keyPage={'serviciosPage'}>
          <section className="secBox inlineFlex servpIntro">
            
            <div className="servpIntroFloat">
              <Container>
                {infoPage && infoPage.pserv_intro_txt ?
                  <div className="txt">
                    <div dangerouslySetInnerHTML={{__html: infoPage.pserv_intro_txt}}></div>

                  </div>

                :
                  <div className="txt"></div>
                }
              </Container>
            </div>
            
            <figure>
              {infoPage && infoPage.pserv_intro_img ? 
                <img src={infoPage.pserv_intro_img} alt="" />
              :
                <img src={nosotrosImg} alt="" />
              }
              
            </figure>
            <div className="servpIntroDet">
              <img src={nosotrosDetBottom} alt="" />
            </div>
          </section>

          <section className="secBox servpValores">
            <Container>
              <div className="inlineFlex servpValoresList">
                {infoPage && infoPage.pserv_serv_list && infoPage.pserv_serv_list.length > 0 &&
                  <ul>
                    {infoPage.pserv_serv_list.map((item,index)=>(
                      <li>
                        <figure>
                          <img src={item.pserv_serv_limg} alt="" />
                        </figure>
                        {item.pserv_serv_ltxt &&
                          <div className="txt" >
                            <div dangerouslySetInnerHTML={{__html: item.pserv_serv_ltxt}}></div>
                            <div onClick={()=>handleOpen(index)} className="btnPrimary">
                              Solicitar información
                            </div>
                          </div>
                        }
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </Container>
            <div className="inlineFlex servpValoresBack">
              <img src={nosotrosValoresBack} alt="" />
            </div>
          </section>
        </LayoutCont>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="inlineFlex servModal">
            {showForm === 0 ?
              <ServFormPreprensa handleClose={handleClose} />
            : showForm === 1 ?
              <ServFormPrensa handleClose={handleClose} />
            :
              <ServFormPostPrensa handleClose={handleClose} />
            }
          </div>
        </Modal>

    </LayoutPages>
  )
};

export default ServiciosPage;
