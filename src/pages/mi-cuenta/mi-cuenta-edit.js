import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";


import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import CircularProgress from '@mui/material/CircularProgress';

import Alert from '@mui/material/Alert';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

const MiCuentaEdit = ({handleClose}) => {

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
      cname: Yup.string(),
      clastname: Yup.string(),
      cphone: Yup.string(),
  });

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset
  } = useForm({
      mode: "all",
      shouldUnregister: false,
      resolver: yupResolver(validationSchema),
      defaultValue: {
        cmail:token.user.email,
        cname:token.user.first_name,
        clastname:token.user.last_name,
        cphone:token.user.acf.billing_phone,
        ctipodoc:token.user.acf.wc_user_dni
      }
  });

  const [errorList,setErrorList] = useState();
  
  const onSubmit = (data) => {

    setLoadForm(true);

    axios.put(baseUrl+'/wp-json/wc/v3/customers/'+token.user.id+'?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs,
            {
                first_name: data.cname,
                last_name: data.clastname,
                phone: data.cphone,
                meta_data:[
                    {
                        id: 1,
                        key: 'wc_user_dni',
                        value: data.ctipodoc
                    }
                ],
                billing:{
                    phone:data.cphone,
                }
            }
    ).then((resp)=>{
        getInfo();
        
    }).catch((error)=>{
        setLoadForm(false);
        setErrorList(error);
    })
  }

  const getInfo = () =>{
    axios.get(baseUrl+'/wp-json/wc/v3/customers/'+token.user.id+'?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs)
    .then((resp)=>{
        const tokenTmp = token;
        tokenTmp.user.acf = resp.data.acf;
        tokenTmp.user.first_name= resp.data.first_name;
        tokenTmp.user.last_name= resp.data.last_name;
        tokenTmp.user.name = resp.data.first_name +' '+ resp.data.last_name;
        handleUpdateToken(tokenTmp);
        setLoadForm(false);
        handleClose();
                  
    }).catch((err)=>{
        setLoadForm(false);
        console.log(err)
    })
  }

  useEffect(()=>{
    if(token){
      setFieldBody({
        cmail:token.user.email,
        cname:token.user.first_name,
        clastname:token.user.last_name,
        cphone:token.user.acf.billing_phone,
        ctipodoc:token.user.acf.wc_user_dni
      })
    }

  },[]);

useEffect(() => {
  const cargarDatos = async () => {
    reset({
        cmail:token.user.email,
        cname:token.user.first_name,
        clastname:token.user.last_name,
        cphone:token.user.acf.billing_phone,
        ctipodoc:token.user.acf.wc_user_dni
    });
  };

  cargarDatos();
}, [reset]);


  return (
    <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
        <Grid container fullWidth spacing={2}>

            <Grid className={errors.cmail ? 'textField textFieldWhite' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
                <TextField 
                    label="Correo" 
                    name="cmail"
                    fullWidth
                    value={fieldBody.cmail}
                    id="cmail"
                    variant="filled"
                    onChange={changeField}
                    disabled
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
                    disabled
                    onChange={changeField}
                    {...register("ctipodoc")}
                    error={errors.ctipodoc ? true : false}
                />
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
                    <button className={'btnPrimary btnPrimaryBack'}
                        onClick={handleClose}
                    >
                        Volver
                    </button>

                </div>
            </Grid>
        </Grid>
    </form>
  )
};

export default MiCuentaEdit;
