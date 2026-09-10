import { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Grid from '@mui/material/Grid';

import CircularProgress from '@mui/material/CircularProgress';

import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Alert from '@mui/material/Alert';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

const MiCuentaChangePass = ({handleClose}) => {

    const [fieldBody,setFieldBody] = useState({});
    const [loadForm,setLoadForm] = useState(false);

    const { baseUrl, keysWc, handleUpdateToken, token } = useAuthContext();

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

    const [errorList,setErrorList] = useState();
    
    const onSubmit = (data) => {

        setLoadForm(true)
        axios.put(baseUrl+'/wp-json/wc/v3/customers/'+token.user.id+'?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs,
                {
                    password: data.cpassword,
                }
        )
            .then((resp)=>{
                axios.post(baseUrl+'wp-json/jwt-auth/v1/token',
                    {
                        username: token && token.user && token.user.email ? token.user.email : '',
                        password:data.cpassword
                        
                    }
                ).then((resp2)=>{
                    handleUpdateToken(resp2.data)
                    setLoadForm(false)
                    handleClose();
                }).catch((err)=>{
                    setLoadForm(false)
                    console.log(err)
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

        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container fullWidth spacing={2}>

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

                <Grid 
                    item 
                    size={{ xs: 12, sm: 12, md: 12, }} 
                    className={'textFielCheck'}
                >
                    {errors && errors.cpassword &&
                        <Alert severity="error">{errors.cpassword.message}</Alert>
                    }
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
                                    Guardar
                                </div>
                                <div className="load">
                                    <CircularProgress size={20} />
                                </div>
                            </div>
                        :
                            <button className={'btnPrimary'} type={'submit'}>
                                Guardar
                            </button>
                        }
                        <div className={'btnPrimary btnPrimaryBack'}
                            onClick={handleClose}
                        >
                            Volver
                        </div>

                    </div>
                </Grid>
            </Grid>
        </form>

    )
};

export default MiCuentaChangePass;
