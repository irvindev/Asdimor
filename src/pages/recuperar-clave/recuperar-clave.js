import { useState, useEffect } from "react";
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import Container from '@mui/material/Container';
import { useAuthContext } from './../../context/authContext';

import axios from 'axios';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useNavigate } from "react-router";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

import olvide_clave_icon from '../../assets/img/olvide_clave_icon.png';

import './recuperar-clave.scss';

const RecuperarClavePage = (props) => {

    const { baseUrl } = useAuthContext();

    const [respRquest,setRespRquest] = useState();
    const [respValid,setRespValid] = useState(false);
    const [loadForm,setLoadForm] = useState(false);
    
    const getInf = (forgotEmail) => {
        setLoadForm(true)
        axios.post(baseUrl+'wp-json/custom/v1/reset-password',{
            email: forgotEmail,
            url: process.env.REACT_APP_SITE_URL+'/restablecer-clave/'
        }).then((resp)=>{
            setLoadForm(false);
            //navigate('/');
            setRespValid(true);
        }).catch((errr)=>{
            setLoadForm(false)
            setRespRquest(errr.response.data.message)
        })
    }

    let navigate = useNavigate();
    const [fieldBody,setFieldBody] = useState({});
    
    const changeField = (e) =>{
        setFieldBody({
            ...fieldBody,
            [e.target.name]: e.target.value
        })
    }

    const validationSchema = Yup.object().shape({
        cmail: Yup.string().email().required()
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
        setRespRquest()
        getInf(data.cmail);
    }

    useEffect(()=>{
    },[])

    return (
        <LayoutPages classComp={'registroPageCont'}>
            <LayoutCont keyPage={'registroPage'}>
                <Container>
                    <div className="titleSections">
                        <h1>Recuperar clave</h1>
                    </div>
                    <div className="inlineBlock recClavePage">

                        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>

                            <Grid container fullWidth spacing={2}>
                                <div className="inlineBlock rpTitle">
                                    <h2>¿Olvidaste tu contraseña?</h2>
                                    <p>
                                        Introduce la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace para que puedas restablecerla
                                    </p>
                                    
                                </div>

                                <Grid className={errors.cmail ? 'textField textFieldWhite' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
                                    <TextField 
                                        label="Ingrese su correo por favor" 
                                        name="cmail"
                                        fullWidth
                                        id="cmail"
                                        variant="filled"
                                        onChange={changeField}
                                        {...register("cmail")}
                                    />
                                </Grid>
                                {respRquest && 
                                    <Alert className={'inlineBlock'} severity="error">{respRquest}</Alert>
                                }
                                <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                                    {loadForm === true ?
                                        <button className={'btnPrimary btnPrimaryDisabled'} >
                                            <div className={'text'}>Ingresar</div>
                                            <div className="load"><CircularProgress  size="25px" /></div>
                                        </button>
                                    :
                                        <button className={'btnPrimary'} type={'submit'}>
                                            <div className={'text'}>Enviar</div>
                                        </button>
                                    }
                                </Grid>
                                {respValid &&
                                    <Alert fullWidth className={'alertInfo alertInfoBig'} icon={<CheckIcon fontSize="inherit" />} severity="success">
                                        <strong>¡Listo! Te hemos enviado un correo. </strong> 
                                        Hemos enviado un enlace de recuperación a la dirección que proporcionaste. 
                                        Haz clic en el enlace del mensaje para crear tu nueva contraseña. Este enlace caducará en 24 horas. 
                                    </Alert>
                                }
                            </Grid>
                        </form>
                        <figure>
                            <img src={olvide_clave_icon} alt="" />
                        </figure>
                    </div>
                </Container>
            </LayoutCont>
        </LayoutPages>
    )
};

export default RecuperarClavePage;
