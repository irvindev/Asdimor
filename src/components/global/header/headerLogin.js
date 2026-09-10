import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthContext } from '../../../context/authContext';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import Alert from '@mui/material/Alert';

import axios from 'axios';
import { Link } from 'react-router';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import './headerLogin.scss';


const HeaderLogin = ({handleClose}) => {

    const [fieldBody,setFieldBody] = useState({});
    const [loadForm,setLoadForm] = useState(false);

    const { baseUrl, keysWc, handleUpdateToken } = useAuthContext();

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
        cmail: Yup.string().email().required(),
        cpassword: Yup.string().min(8, "Deben tener al menos ocho caracteres.").required()
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

        setLoadForm(true);

        axios.post(baseUrl+'wp-json/jwt-auth/v1/token',
            {
                username:data.cmail,
                password:data.cpassword
            }
        ).then((resp)=>{
            handleUpdateToken(resp.data);
            setLoadForm(false)
            handleClose();
        }).catch((err)=>{
            setErrorList(err)
            setLoadForm(false)
        })
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    return (
        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
            <div onClick={()=>handleClose()} className="hlClosedAction">
                <CloseIcon />
            </div>
            <div className="titleSections">
                <h3>Ingresar</h3>
            </div>
            <Grid container fullWidth spacing={2}>
                <Grid 
                    className={errors.cmail ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    item 
                    size={{ xs: 12, sm: 12, md: 12, }}
                >
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

                <Grid 
                    item 
                    size={{ xs: 12, sm: 12, md: 12, }} 
                    className={errors.cpassword? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite'}
                >
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

                {true &&
                    <Grid 
                        size={{ xs: 12, sm: 12, md: 12, }}
                    >
                        <ul className={'hlOptionsList'}>
                            {false &&
                                <li className={'hlCheckItem'}>
                                    <FormGroup>
                                        <FormControlLabel 
                                            control={
                                                <Checkbox />
                                            } 
                                            label={
                                                <span>
                                                    He leído y autorizo el tratamiento de mis datos según la <Link className={'linkGeneral'} target={'_blank'} to={'/politicas-de-privacidad'}>Política de Privacidad</Link> y <Link className={'linkGeneral'} target={'_blank'} to={'/terminos-y-condiciones'}>Términos y Condiciones</Link>
                                                </span>
                                            }
                                        />
                                    </FormGroup>
                                </li>
                            }
                            <li className={'hlForgotPass'} onClick={()=>handleClose()}>
                                <SyncLockIcon /> <Link to={'/recuperar-clave'}>Olvide mi contraseña</Link>
                            </li>
                            <li className={'hlForgotPass'} onClick={()=>handleClose()}>
                                <ExitToAppIcon /> <Link to={'/registro'}>No tengo cuenta. Regístrame</Link>
                            </li>
                        </ul>
                    </Grid>
                }

                {errorList &&
                    <Grid className={'textFielCheck'} item size={{ xs: 12, sm: 12, md: 12 }}>
                        <Alert severity="error" >
                            <div className="inlineBlock alertLoginError" dangerouslySetInnerHTML={{__html: errorList.response.data.message}}></div>
                        </Alert>
                    </Grid>
                }
                
                <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                    <div className="inlineFlex  hlBtnBox">
                        {loadForm === true ?
                            <button className={'btnPrimary btnPrimaryDisabled'} >
                                <div className={'text'}>Ingresar</div>
                                <div className="load"><CircularProgress  size="25px" /></div>
                            </button>
                        :
                            <button className={'btnPrimary'} type={'submit'}>
                                <div className={'text'}>Ingresar</div>
                            </button>
                        }

                        {false &&
                            <Link to={'/registro'} className={'btnPrimary btnPrimaryBack'}
                                onClick={handleClose}
                            >
                                <div className={'text'}>Registrarme</div>
                            </Link>
                        }
                    </div>
                </Grid>

            </Grid>
        </form>
    )
};

export default HeaderLogin;
