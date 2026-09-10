import React from "react"
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import Container from '@mui/material/Container';

import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useNavigate } from "react-router";

import CircularProgress from '@mui/material/CircularProgress';


import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router';

import Alert from '@mui/material/Alert';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

import './registro.scss';

const RegistroPage = (props) => {

    let navigate = useNavigate();
    const [fieldBody,setFieldBody] = useState({});
    const [loadForm,setLoadForm] = useState(false);

    const { baseUrl, keysWc,handleUpdateToken } = useAuthContext();


    const changeField = (e) =>{
        if( e.target.type === 'checkbox'){
            setFieldBody({
                ...fieldBody,
                [e.target.name]: e.target.checked
            })
        }else{
            setFieldBody({
                ...fieldBody,
                [e.target.name]: e.target.value
            })
        }
    }

    const validationSchema = Yup.object().shape({
        cname: Yup.string().required("Ingrese su nombre por favor.").min(2).max(45),
        clastname: Yup.string().required("Ingrese su nombre por favor.").min(2).max(150),
        cmail: Yup.string().email().required(),
        cphone: Yup.string().required("Ingrese el nombre por favor.").min(6).max(15),
        ctipodoc: Yup.string().required("Ingrese el nombre por favor.").min(8).max(9),
        cpassword: Yup.string().min(8, "Deben tener al menos ocho caracteres.").required()
            .matches(/^(?=.*[a-z])/,"Incluir mayúsculas y minúsculas.")
            .matches(/^(?=.*[A-Z])/,"Incluir mayúsculas y minúsculas.")
            .matches(/^(?=.*[0-9])/,"Incluir números.")
            .matches(/(?=.*[!@#$%^&*"/=\?\(\)\\])/,"Incluir símbolos."),
            
        cpasswordConfirm: Yup
            .string()
            .required('Las contraseñas no coinciden.')
            .oneOf([Yup.ref('cpassword'), null], 'Passwords must match'),
        creprom: Yup.boolean().oneOf([true], "Debe aceptar los términos o condiciones"),
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

    const [errorList,setErrorList] = useState();
    
    const onSubmit = (data) => {

        setLoadForm(true)
        axios.post(baseUrl+'/wp-json/wc/v3/customers?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs,
                {
                    email: data.cmail,
                    first_name: data.cname,
                    last_name: data.clastname,
                    username: data.cmail,
                    phone: data.cphone,
                    password: data.cpassword,
                    meta_data:[
                        {
                            id: 1,
                            key: 'wc_user_dni',
                            value: data.ctipodoc
                        },
                        {
                            id: 2,
                            key: 'wc_user_ruc',
                            value: data.cfactruc
                        },
                        {
                            id: 2,
                            key: 'wc_user_reprom',
                            value: data.creprom
                        }
                    ],
                    billing:{
                        phone:data.cphone,
                    }
                }
        )
            .then((resp)=>{
                axios.post(baseUrl+'wp-json/jwt-auth/v1/token',
                    {
                        username:data.cmail,
                        password:data.cpassword
                        
                    }
                ).then((resp)=>{
                    setLoadForm(false)
                    handleUpdateToken(resp.data);
                    navigate('/');
                }).catch((err)=>{
                    console.log(err)
                    setLoadForm(false);
                })
                
            }).catch((error)=>{
                setLoadForm(false)
                setErrorList(error)
            })
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    
    return (
        <LayoutPages classComp={'registroPageCont'}>
            <LayoutCont keyPage={'registroPage'}>
                <Container>
                    <div className="titleSections">
                        <h1>Registro</h1>
                    </div>
                    <div className="registroPageBox">
                        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
                            <Grid container fullWidth spacing={2}>

                                <Grid className={errors.cmail ? 'textField textFieldWhite' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
                                    <TextField 
                                        label="Correo" 
                                        name="cmail"
                                        fullWidth
                                        id="cmail"
                                        variant="filled"
                                        onChange={changeField}
                                        {...register("cmail")}
                                    />
                                </Grid>

                                <Grid className={errors.cname ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 6 }}>
                                    <TextField 
                                        label="Nombres" 
                                        variant="filled"
                                        name="cname"
                                        id="cname"
                                        fullWidth
                                        onChange={changeField}
                                        {...register("cname")}
                                    />
                                </Grid>

                                <Grid className={errors.clastname ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 6 }}>
                                    <TextField 
                                        label="Apellidos" 
                                        variant="filled"
                                        name="clastname"
                                        id="clastname"
                                        fullWidth
                                        onChange={changeField}
                                        {...register("clastname")}
                                    />
                                </Grid>

                                <Grid className={errors.cphone ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 6, }}>
                                    <TextField 
                                        label="Teléfono" 
                                        variant="filled"
                                        name="cphone"
                                        type={'number'}
                                        fullWidth
                                        id="cphone"
                                        onChange={changeField}
                                        {...register("cphone")}
                                    />
                                </Grid>

                                <Grid className={errors.ctipodoc ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 6, }}>
                                    <TextField 
                                        label="DNI / Carnet de ext. / Pasaporte" 
                                        variant="filled"
                                        name="ctipodoc"
                                        type={'number'}
                                        fullWidth
                                        id="ctipodoc"
                                        onChange={changeField}
                                        {...register("ctipodoc")}
                                        error={errors.ctipodoc ? true : false}
                                    />
                                </Grid>

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
                                    <Alert className={'alertInfo'} severity="info">La contraseña debe ser alfanumerica por ejemplo: <strong>Clave123!</strong> </Alert>
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
                                {errors && errors.cpassword &&
                                <Grid 
                                    item 
                                    size={{ xs: 12, sm: 12, md: 12, }} 
                                    className={'textFielCheck'}
                                >
                                    
                                        <Alert severity="error">{errors.cpassword.message}</Alert>
                                    
                                </Grid>
                                }

                                <Grid className={'textFielCheck'} item size={{ xs: 12, sm: 12, md: 12, }}>
                                    <FormGroup>

                                        <FormControlLabel 
                                            label={<span>He leído y autorizo el tratamiento de mis datos según la <Link target={'_blank'} to={'/politicas-de-privacidad'}>Política de Privacidad</Link> y <Link to={'/terminos-y-condiciones'}> Términos y Condiciones</Link></span>  }
                                            error={errors.creprom ? true : false}
                                            control={
                                            <Checkbox
                                                    name={'creprom'}
                                                    value={fieldBody.creprom} 
                                                    {...register("creprom")}
                                                    onChange={changeField}
                                                />
                                            }
                                        />
                                    </FormGroup>
                                </Grid>

                                

                                {errorList &&
                                    <Grid className={'textFielCheck'} item size={{ xs: 12, sm: 12, md: 12, }}>
                                        <Alert severity="error" >{errorList ? errorList.response.data.message : '' }</Alert>
                                    </Grid>
                                }

                

                                <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                                    <div className="inlineFlex checoStepperBtn">

                                        {loadForm ?
                                            <div className={'btnPrimary btnPrimaryDisabled'}>
                                                <div className="text">
                                                    Registrarme
                                                </div>
                                                <div className="load">
                                                    <CircularProgress size={20} />
                                                </div>
                                            </div>
                                        :
                                            <button className={'btnPrimary'} type={'submit'}>
                                                Registrarme
                                            </button>
                                        }
                                    </div>
                                </Grid>

                            </Grid>
                        </form>
                    </div>
                </Container>
            </LayoutCont>
        </LayoutPages>
    )
};

export default RegistroPage;
