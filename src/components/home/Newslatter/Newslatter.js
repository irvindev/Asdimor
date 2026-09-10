import { useState, useEffect} from "react";
import './Newslatter.scss';

import CloseIcon from '@mui/icons-material/Close';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import { useAuthContext } from './../../../context/authContext';

const HomeNewslatter = ({handleClose,infoConf}) => {

    const [loadForm,setLoadForm] = useState(false);
    const [newsOpen,setNewsOpen] = useState(false);
    const [respForm,setRespForm] = useState({
        state:false,
        resp:null,
        msgSussess:null
    });

    const { baseUrl } = useAuthContext();

    const validationSchema = Yup.object().shape({
        encName: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        encMail: Yup.string().email().required(),
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


    const onSubmit = (data) => {
        setLoadForm(true);
        const emailBody = {
            "nombre": data.encName,
            "correo": data.encMail,
            "_wpcf7_unit_tag": "95523d7"
        };
        
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/926/feedback',form).then((resp)=>{
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
        if(infoConf){
            //setNewsOpen(true);
            if (infoConf.confPopupSwitch?.length) {
                setNewsOpen(true);
            }
        }
    },[infoConf])

    return (
        <div className={newsOpen ? "homePopup homePopupAct" :"homePopup"}>
            <div className="inlineFlex homePopupCont">
                <div className="closedPopup" onClick={()=>{setNewsOpen(false)}}>
                    <CloseIcon/>
                </div>
                {infoConf &&
                    <div className="inlineFlex homePopupBox">
                        <figure>
                        <img src={infoConf && infoConf.configuracionesFields?.conf_popup_img ? infoConf.configuracionesFields?.conf_popup_img : '' } alt="" />
                        </figure>
                        <div className="homePopupTxt">
                            <div className="homePopupTitle"  dangerouslySetInnerHTML={{__html: infoConf.configuracionesFields?.conf_popup_txt}}></div>
                            <form  onSubmit={handleSubmit(onSubmit)}>
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
                }
            </div>
        </div>
    )
};

export default HomeNewslatter;
