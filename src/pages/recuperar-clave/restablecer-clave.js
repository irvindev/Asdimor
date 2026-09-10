import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';

import axios from 'axios';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useNavigate } from "react-router";
import Grid from '@mui/material/Grid';

import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';

import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';


import LayoutCont from '../../components/LayoutCont/LayoutCont';
import LayoutPages from '../../components/LayoutPages/LayoutPages';
import Container from '@mui/material/Container';

import olvide_clave_icon from '../../assets/img/olvide_clave_icon.png';
import { useAuthContext } from './../../context/authContext';

const RestablecerClavePage = (props) => {

    const [searchParams] = useSearchParams();

    const [keyParam, setKeyParam] = useState('');
    const [login, setLogin] = useState('');
    const [loadForm,setLoadForm] = useState(false);

    const { baseUrl, loginOpen, setLoginOpen } = useAuthContext();
 
    let navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        cpassword: Yup.string().min(8, "Deben tener al menos ocho caracteres.").required()
            .matches(/^(?=.*[a-z])/,"Incluir mayúsculas y minúsculas.")
            .matches(/^(?=.*[A-Z])/,"Incluir mayúsculas y minúsculas.")
            .matches(/^(?=.*[0-9])/,"Incluir números.")
            .matches(/(?=.*[!@#$%^&*"/=\?\(\)\\])/,"Incluir símbolos."),
        cpasswordConfirm: Yup
            .string()
            .required('Las contraseñas no coinciden.')
            .oneOf([Yup.ref('cpassword'), null], 'Passwords must match')
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
    
    const [errorInfo,setErrorInfo ] = useState(false);

    const changePass = (data) =>{
        axios.post(baseUrl+'/wp-json/custom/v1/confirm-reset',
            {
                key: keyParam,
                login: login,
                password: data.cpassword
            }
        ).then((resp)=>{
            handleOpen();
        }).catch((error)=>{
            setErrorInfo(true);
        })
    }

    const onSubmit = (data) => {
        //console.log('onSubmit',data);
        //setRespRquest();
        changePass(data);
    }

    useEffect(() => {
        const key   = searchParams.get('key');
        const loginParam = searchParams.get('login');

        if (!key || !loginParam) {
            //console.log('Link inválido');
            return;
        }

        console.log('aqui taaaa ==>',{
            key:key,
            loginPar:loginParam
        })
        setKeyParam(key);
        setLogin(loginParam); // ya viene decodificado
    }, [searchParams]);


    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const validAndLog = (item) =>{
        if(item ===  0){
            navigate('/');
            setLoginOpen(true);
        }else{
            navigate('/');
        }
    }

    return (
        <LayoutPages classComp={'registroPageCont'}>
            <LayoutCont keyPage={'registroPage'}>
                <Container>
                    <div className="titleSections">
                        <h1>Restablecer contraseña</h1>
                    </div>
                    <div className="inlineBlock recClavePage">

                        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>

                            <Grid container fullWidth spacing={2}>
                                <div className="inlineBlock rpTitle">
                                    <p>
                                        Escribe tu nueva contraseña y vuelve a ingresarla para asegurarnos de que coincidan
                                    </p>
                                </div>

                                <Grid 
                                    item 
                                    size={{ xs: 12, sm: 12, md: 6, }} 
                                    className={errors.cpassword? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite'}>
                                    <FormControl sx={{width: '100%'}} variant="filled">
                                        <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                        <FilledInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label={'Contraseña'}
                                            {...register("cpassword")}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid 
                                    item 
                                    size={{ xs: 12, sm: 12, md: 6, }} 
                                    className={errors.cpasswordConfirm ? 'textField textFieldWhite textFieldError': 'textField textFieldWhite'}
                                >
                                    <FormControl sx={{width: '100%'}} variant="filled">
                                        <InputLabel htmlFor="outlined-adornment-password2">Confirmar contraseña</InputLabel>
                                        <FilledInput
                                            id="standard-adornment-password2"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="Confirmar contraseña"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label={'Confirmar contraseña'}
                                            {...register("cpasswordConfirm")}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid 
                                    item 
                                    size={{ xs: 12, sm: 12, md: 12, }} 
                                    className={'textField textFieldWhite'}>
                                    <Alert className={'alertInfo'} severity="info">La contraseña debe ser alfanumerica por ejemplo: <strong>Clave123!</strong> </Alert>
                                </Grid>

                                {errors && errors.cpassword &&
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }} 
                                        className={'textFielCheck'}
                                    >
                                        <Alert severity="error">{errors.cpassword.message}</Alert>   
                                    </Grid>
                                }
                                {errorInfo &&
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }} 
                                        className={'textFielCheck'}
                                    >
                                        <Alert severity="error">{errors.cpassword.message}</Alert>   
                                    </Grid>
                                }

                                <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                                    <div className="inlineFlex checoStepperBtn">
                                        {loadForm ?
                                            <div className={'btnPrimary btnPrimaryDisabled'}>
                                                <div className="text">
                                                    Cambiar
                                                </div>
                                                <div className="load">
                                                    <CircularProgress size={20} />
                                                </div>
                                            </div>
                                        :
                                            <button className={'btnPrimary'} type={'submit'}>
                                                Cambiar
                                            </button>
                                        }

                                    </div>
                                </Grid>
                            </Grid>
                        </form>

                        <figure>
                            <img src={olvide_clave_icon} alt="" />
                        </figure>
                    </div>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className="recClavModalCont">
                            {false&&
                                <div className="recClose" onClick={handleClose}>
                                    <CloseIcon />
                                </div>
                            }
                            <div className="title">
                                <h2>¡Todo listo! Ya puedes volver a entrar 🚀</h2>
                                <p>Solo queríamos confirmarte que tu contraseña se ha actualizado correctamente.</p>

                            </div>
                            <div className="inlineFlex btnBox">
                                <div onClick={()=>validAndLog(0)} className="btnPrimary">
                                    Ingresar
                                </div>
                                <div onClick={()=>validAndLog(1)} className="btnPrimary">
                                    Volver al inicio
                                </div>
                            </div>
                        </div>
                    </Modal>

                </Container>
            </LayoutCont>
        </LayoutPages>
    )
};

export default RestablecerClavePage;
