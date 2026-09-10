import React,{ useState } from "react";
import axios from 'axios';

import TextField from '@mui/material/TextField';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Grid from '@mui/material/Grid';
import { useAuthContext } from './../../context/authContext';

import Autocomplete from '@mui/material/Autocomplete';

import deparList from '../../assets/js/departamentos.json';
import distritoList from '../../assets/js/distritos.json';
import provList from '../../assets/js/provincias.json';

import CloseIcon from '@mui/icons-material/Close';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const ServFormPostPrensa = ({handleClose}) => {

    const [ fieldBody, setFieldBody ] = useState({});
    const { baseUrl, setDeliveryDep } = useAuthContext();

    const [selectDepart, setSelectDepart] = useState('');
    const [provinciasState,setProviciasState] = useState('');
    const [distritoState,setDistritoState] = useState('');

    const [datosAuto,setDatosAuto] = useState({
        pais: null,
        departamento: null,
        provincia: null,
        distrito: null,
        tipoProdList: null,
        cantList: null,
        pagesList: null,
        formatList: null,
        colorList: null,
        papelIntList: null,
        cubiertaList: null,
        papelTapas: null,
        laminadoList: null,
        encList: null,
    });

    const formatList = [
        {id:1, name:'Doblado'},
        {id:2, name:'Encolado'},
        {id:3, name:'Cocido'},
        {id:4, name:'Alzado'},
        {id:5, name:'Laminado'},
        {id:6, name:'Emgrapado'},
        {id:7, name:'Empastado'},
        {id:8, name:'Refilado'},
        {id:9, name:'Termosellado'},
        {id:10, name:'Todos'},
    ]

    const colorList =[
        {id:1, name:'1 color'},
        {id:2, name:'2 color'},
        {id:3, name:'4 color'},
    ]

    const changeDepart = (event,value) => {
        if(value === null || value.id_ubigeo === null  ){
            setSelectDepart()
            setProviciasState(provList["3926"]);    
        }else{
            setSelectDepart(value.id_ubigeo)
            setProviciasState(provList[value.id_ubigeo]);
        }
        setDatosAuto({
            ...datosAuto,
            departamento:value,
            provincia:null,
            distrito:null
        });
    };

    const changeProv = (event,value) => {
        if(value === null || value.id_ubigeo === null  ){
            setDeliveryDep();
            setDistritoState(distritoList["3927"]);    
        }else{
            setDeliveryDep(value.nombre_ubigeo);
            setDistritoState(distritoList[value.id_ubigeo]);
        }
        setDatosAuto({
            ...datosAuto,
            provincia:value,
            distrito:null
        })
    };

    const changeDist = (event,value) => {
        setDatosAuto({
            ...datosAuto,
            distrito:value
        })
    };

    const validationSchema = Yup.object().shape({
        posnombre: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        postelefono: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        poscorreo: Yup.string().email().required(),
        posFormatList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        posColorList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        posdettrab: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "all",
        shouldUnregister: false,
        resolver: yupResolver(validationSchema),
    });
    
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

    const [loadForm,setLoadForm] = useState(false);
    const [depAbrev,setDepAbrev]  = useState();


    const [respForm,setRespForm] = useState({
        state:false,
        resp:null,
        msgSussess:null
    });


    const onSubmit = (data) => {
        //console.log(data);

        const emailBody = {
            "nombres": data.posnombre,
            "telefono": data.postelefono,
            "correo": data.poscorreo,
            "servicio": data.posFormatList,
            "cantidad": data.posColorList,
            "mensaje": data.posdettrab,
            "_wpcf7_unit_tag": "99afea1"
        };

        
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/914/feedback',form).then((resp)=>{
            setLoadForm(false);
            setRespForm({
                state:true,
                resp:resp.data.status,
                msgSussess:resp.data.message
            });
            reset();
            //handleClose();
        }).catch((error)=>{
            setLoadForm(false);
            console.log(error);
        });
        
    }

    return (
        <div className="inlineFlex servModalBox">
            <div onClick={()=>handleClose()} className="servModalBoxClose">
                <CloseIcon />
            </div>
            <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={'textField textFieldWhite'} 
                    >
                        <h3>Pos-Prensa</h3>
                    </Grid>
                
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.posnombre ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="posnombre" 
                            name="posnombre"
                            label="Nombres completos:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("posnombre")}
                            error={errors.posnombre ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.postelefono ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="postelefono" 
                            name="postelefono"
                            label="Teléfono:" 
                            type={'number'}
                            variant="filled" 
                            onChange={changeField}
                            {...register("postelefono")}
                            error={errors.postelefono ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={errors.poscorreo ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="poscorreo" 
                            name="poscorreo"
                            label="Correo:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("poscorreo")}
                            error={errors.poscorreo ? true : false}
                        />
                    </Grid>

                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.posFormatList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="posFormatList"
                            name="posFormatList"
                            options={formatList}
                            getOptionLabel={(option) => {
                                return option.name;
                            }}
                            fullWidth
                            value={datosAuto.formatList}
                            onChange={(event,value)=>{
                                setDatosAuto({
                                    ...datosAuto,
                                    formatList:value
                                });
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Servicios:" 
                                    variant="filled" 
                                    {...register("posFormatList")} 
                                    error={errors.posFormatList ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.posColorList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="posColorList" 
                            name="posColorList"
                            label="Cantidad: Pliegos / Libros / Revistas" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("posColorList")}
                            error={errors.posColorList ? true : false}
                        />
                    </Grid>


                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={errors.posdettrab ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' }
                    >
                        <TextField
                            id="posdettrab" 
                            name="posdettrab"
                            variant="filled" 
                            onChange={changeField}
                            {...register("posdettrab")}
                            error={errors.posdettrab ? true : false}
                            label="Especificar detalles del trabajo: medidas del producto"
                            multiline
                            fullWidth
                            rows={4}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={'textField textFieldWhite textFieldWhiteError' }
                    >
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
                    </Grid>

                    {respForm && respForm.state  &&
                        <Grid 
                            item 
                            size={{ xs: 12, sm: 12, md: 12, }}
                            className={'textField textFieldWhite textFieldWhiteError' }
                        >
                            <Alert className={'alertInfo'} fullWidth severity="success">
                                Su mensaje ha sido enviado correctamente. Nos pondremos en contacto con usted a la brevedad posible.
                            </Alert>  
                        </Grid>
                    }
                </Grid>
            </form>
        </div>
    )
};

export default ServFormPostPrensa;
