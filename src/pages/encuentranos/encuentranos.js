import {useState,useEffect,useCallback} from "react";
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';

import './encuentranos.scss';

import Container from '@mui/material/Container';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';

import icoMarker  from '../../assets/img/ico_marker.png';
import icoPhone from '../../assets/img/ico_contacto_phone.png';

import icoFb from '../../assets/img/ico_fb.png';

import CircularProgress from '@mui/material/CircularProgress';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from '@mui/material/Alert';

import TextField from '@mui/material/TextField';

import axios from 'axios';

import { 
    APIProvider,
    InfoWindow,
    Map,
    AdvancedMarker,
    useAdvancedMarkerRef
  } from '@vis.gl/react-google-maps';

const EncuentranosPage = (props) => {

    const [breadCrumb,setBreadCrumb] = useState([
            {
                name:'Inicio',
                link:'/'
            },
            {
                name:'Encuentranos',
            }
    ]);

    const [markerRef, marker] = useAdvancedMarkerRef();

    const [infoWindowShown, setInfoWindowShown] = useState(true);

    // clicking the marker will toggle the infowindow
    const handleMarkerClick = useCallback(
        () => setInfoWindowShown(isShown => !isShown),
        []
    );

    // if the maps api closes the infowindow, we have to synchronize our state
    const handleClose = useCallback(() => setInfoWindowShown(false), []);


    const baseUrl = process.env.REACT_APP_BASE_URL;

    const [infoPage,setInfoPage] = useState();
    const getInfoPage = ()=>{
        axios.get(baseUrl+'wp-json/wp/v2/pages/543')
        .then((resp)=>{
            console.log(resp.data.acf)
            setInfoPage(resp.data.acf);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const validationSchema = Yup.object().shape({
        encName: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        encPhone: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        encMail: Yup.string().email().required(),
        encMessage: Yup.string().required("Ingrese su nombre por favor.").min(2).max(450),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "all",
        shouldUnregister: false,
        resolver: yupResolver(validationSchema),
    });


    const [respForm,setRespForm] = useState({
        state:false,
        resp:null,
        msgSussess:null
    });
    const [loadForm,setLoadForm] = useState(false);

    const onSubmit = (data) => {
        setLoadForm(true);

        const emailBody = {
            "encName": data.encName,
            "encPhone": data.encPhone,
            "encMail": data.encMail,
            "encMessage": data.encMessage,
            "_wpcf7_unit_tag": "445f153"
        };
        
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/910/feedback',form).then((resp)=>{
            setLoadForm(false);
            
            setRespForm({
                state:true,
                resp:resp.data.status,
                msgSussess:resp.data.message
            })
        }).catch((error)=>{
            console.log(error);
            setLoadForm(false);
        })
        
    }

    useEffect(()=>{
        getInfoPage();
    },[])

    return (
        
        <LayoutPages classComp={'encuentranosPageCont'}>
            <LayoutCont keyPage={'encuentranosPage'}>
                <section className="secBox encuentranosPage">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />
                        <div className="inlineFlex encuentBox">
                            <div className="titleSections">
                                <h1>Encuéntranos</h1>
                            </div>
                            {false &&
                            <div className="encuentMapBox">
                                <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                                    <Map
                                        mapId={'bf51a910020fa25a'}
                                        defaultZoom={13}
                                        defaultCenter={{lat: -11.915864231668476, lng: -77.04791280206123}}
                                        gestureHandling='greedy'
                                        disableDefaultUI>
                                        <AdvancedMarker 
                                            ref={markerRef}
                                            position={{lat: -11.92069528683641, lng: -77.06965468796857}} 
                                            
                                            onClick={handleMarkerClick}
                                        >
                                            <img src={icoMarker} width={20} height={35} /> 

                                        </AdvancedMarker>

                                        {infoWindowShown && (
                                            <InfoWindow anchor={marker} onClose={handleClose} maxWidth={200}>
                                                <div className="inlineBlock encuentInfowindow">
                                                    <h2>Asdimor</h2>
                                                    <p>Av. Chillon Nro. 236 Z.I. Ex Fundo Chacra Cerro</p>
                                                </div>
                                            </InfoWindow>
                                        )}

                                    </Map>

                                </APIProvider>
                            </div>
                            }

                            <div className="inlineFlex inlineFlexLeft encuentInfoBox">
                                <div className="encuentPaperItem encuentInfo">
                                    {infoPage && infoPage.pencuent_info &&
                                        <div  dangerouslySetInnerHTML={{__html: infoPage.pencuent_info}}></div>
                                    }

                                    <div className="phoneBox">
                                        <figure>
                                            <img src={icoPhone} alt="" />
                                        </figure>
                                        <div className="txt">
                                            <div  dangerouslySetInnerHTML={{__html: infoPage && infoPage.pencuent_whats}}></div>
                                        </div>
                                    </div>

                                    <div className="encuentSocial">
                                        <h4>Síguenos en:</h4>

                                        {infoPage && infoPage.pencuent_rs.length && infoPage.pencuent_rs.length > 0 &&
                                        <ul>
                                            {infoPage.pencuent_rs.map((item)=>(
                                            <li>
                                                <a className={'inlineFlex'} href={item.pencuent_rs_txt} target="_blank">
                                                    <img src={item.pencuent_rs_txt ? item.pencuent_rs_ico : icoFb} alt="" />
                                                </a>
                                            </li>
                                            ))}
                                        </ul>
                                        }
                                    </div>


                                </div>
                                <div className="encuentPaperItem encuentForm">
                                    <h3>Déjanos un mensaje</h3>
                                    <form className={'inlineBlock inlineFlexLeft'} onSubmit={handleSubmit(onSubmit)}>
                                        {respForm && respForm.state  &&
                                            <div className={'inlineFlex textField'}>
                                                <Alert className={'alertInfo'} fullWidth severity="success">
                                                    Su mensaje ha sido enviado correctamente. Nos pondremos en contacto con usted a la brevedad posible.
                                                </Alert>  
                                            </div>
                                        }
                                        <div className={errors.encName ? 'inlineFlex textField textFieldError' : 'inlineFlex textField' }>
                                            <TextField 
                                                fullWidth 
                                                name='encName'
                                                id="encName" 
                                                label="Nombres completos:" 
                                                variant="filled" 
                                                {...register("encName")}
                                                error={errors.encName ? true : false}
                                            />
                                        </div>
                                        <div  className={errors.encPhone ? 'inlineFlex textField textFieldError' : 'inlineFlex textField' }>
                                            <TextField 
                                                fullWidth 
                                                name='encPhone'
                                                id="encPhone" 
                                                label="Teléfono:" 
                                                variant="filled" 
                                                {...register("encPhone")}
                                                error={errors.encPhone ? true : false}
                                            />
                                        </div>
                                        <div  className={errors.encMail ? 'inlineFlex textField textFieldError' : 'inlineFlex textField' }>
                                            <TextField 
                                                fullWidth 
                                                name='encMail'
                                                id="encMail" 
                                                label="Correo:" 
                                                variant="filled" 
                                                {...register("encMail")}
                                                error={errors.encMail ? true : false}
                                            />
                                        </div>
                                        <div  className={errors.encMessage ? 'inlineFlex textField textFieldError' : 'inlineFlex textField' }>
                                            <TextField
                                                name='encMessage'
                                                id="filled-multiline-static"
                                                label="Mensaje:"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                variant="filled"
                                                {...register("encMessage")}
                                                error={errors.encMessage ? true : false}
                                            />
                                        </div>

                                        <div className="inlineFlex inlineFlexLeft btnBox">
                                            {loadForm ?
                                                <div  className={'btnPrimary btnPrimaryDisabled'} >
                                                    <div className={'text'}>Ingresar</div> 
                                                    <div className="load"><CircularProgress  size="25px" /></div>
                                                </div>
                                            :
                                                <button  type={'submit'} className={'btnPrimary'}>
                                                    <div className={'text'}>Enviar</div>
                                                </button>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                    </Container>
                </section>
            </LayoutCont>
        </LayoutPages>
    )
};

export default EncuentranosPage;
