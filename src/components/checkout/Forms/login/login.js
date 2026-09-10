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
import { useAuthContext } from './../../../../context/authContext';

import Alert from '@mui/material/Alert';

import axios from 'axios';

const CheckoutLoginForm = ({nextForm,backForm}) => {

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
        cpassword: Yup.string().min(5, "Deben tener al menos ocho caracteres.").required()
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
        axios.post(baseUrl+'wp-json/jwt-auth/v1/token',
            {
                username:data.cmail,
                password:data.cpassword
            }
        ).then((resp)=>{
            //console.log(resp.data)
            handleUpdateToken(resp.data);
            nextForm(1);
            setLoadForm(false);
        }).catch((err)=>{
            //console.log('0==>',err);
            setErrorList(err);
            setLoadForm(false);
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
                <Grid className={errors.cmail ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
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

                {errorList && errorList.response.data.message &&
                    <Grid className={'textFielCheck'} item size={{ xs: 12, sm: 12, md: 12 }}>
                        <Alert severity="error" ><span  dangerouslySetInnerHTML={{__html: errorList.response.data.message }}></span></Alert>
                    </Grid>
                }
                <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                    <div className="inlineFlex checoStepperBtn">

                        {loadForm ?
                            <button className={'btnPrimary btnPrimaryDisabled'} >
                                <div className={'text'}>Ingresar</div> 
                                <div className="load"><CircularProgress  size="25px" /></div>
                            </button>
                        :
                            <button className={'btnPrimary'} type={'submit'}>
                                <div className={'text'}>Ingresar</div>
                            </button>
                        }
                        <button className={'btnPrimary btnPrimaryBack'}
                            onClick={backForm}
                        >
                            <div className={'text'}>Volver</div>
                        </button>

                    </div>
                </Grid>
            </Grid>
        </form>
    )
};

export default CheckoutLoginForm;
