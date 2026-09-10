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

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ServFormPreprensa = ({handleClose}) => {

    const [fieldBody,setFieldBody] = useState({});
    const { baseUrl, setDeliveryDep } = useAuthContext();

    const [selectDepart, setSelectDepart] = useState('');
    const [provinciasState,setProviciasState] = useState('');
    const [distritoState,setDistritoState] = useState('');
    const [datosAuto,setDatosAuto] = useState({
        pais:null,
        departamento:null,
        provincia:null,
        distrito:null,
        servList: null,
        productList: null,
        tipoProdList: null
    });

    const servList = [
        {id:1, name:'Todos'},
        {id:2, name:'Diseño gráfico'},
        {id:3, name:'Edición deTextos'},
    ]



    const tipoProdList = [
        {id:1, name: 'Libros'},
        {id:2, name: 'Revistas'},
        {id:3, name: 'Cuadernos corporativos'},
        {id:4, name: 'Cuadernos promocionales'},
        {id:5, name: 'Papelería corporativa'},
        {id:6, name: 'Material promocional'},
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
        prenombre: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        pretelefono: Yup.string().required("Ingrese su nombre por favor.").min(6).max(12),
        precorreo: Yup.string().email().required(),
        preciudad: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250),
        preprovincia: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250),
        predistrito: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250),
        preservice: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250),
        pretipprod: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250),
        predettrab: Yup.string().required("Ingrese su nombre por favor.").min(3).max(250)
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
        setFieldBody({
            ...fieldBody,
            [e.target.name]: e.target.value
        })
    }

    const [loadForm,setLoadForm] = useState(false);
     const [depAbrev,setDepAbrev]  = useState();
    const [respForm,setRespForm] = useState({
        state:false,
        resp:null,
        msgSussess:null
    });

    const [imgDesign,setImgDesign] = useState();

    const onSubmit = (data) => {

        setLoadForm(true);

        const emailBody = {
            "nombres": data.prenombre,
            "telefono": data.pretelefono,
            "correo": data.precorreo,
            "departamento": data.preciudad,
            "provincia": data.preprovincia,
            "distrito": data.predistrito,
            "servicios": data.preservice,
            "cantidad": '',
            "tipprod": data.pretipprod,
            "diseno": imgDesign ? imgDesign : null,
            "det_trabajo": data.predettrab,
            "_wpcf7_unit_tag": "6bcfa2a"
        };

        
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/773/feedback',form).then((resp)=>{
            setLoadForm(false);
            setRespForm({
                state:true,
                resp:resp.data.status,
                msgSussess:resp.data.message
            });
            reset();
        }).catch((error)=>{
            setLoadForm(false);
            console.log(error);
        })
        
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
                        <h3>Pre-prensa</h3>
                    </Grid>
                
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.prenombre ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prenombre" 
                            name="prenombre"
                            label="Nombres completos:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("prenombre")}
                            error={errors.prenombre ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.pretelefono ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="pretelefono" 
                            name="pretelefono"
                            label="Teléfono:" 
                            type={'number'}
                            variant="filled" 
                            onChange={changeField}
                            {...register("pretelefono")}
                            error={errors.pretelefono ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={errors.precorreo ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="precorreo" 
                            name="precorreo"
                            label="Correo:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("precorreo")}
                            error={errors.precorreo ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.preciudad ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            variant='filled'
                            id="preciudad"
                            name="preciudad"
                            options={deparList}
                            getOptionLabel={(option) => {
                                setDepAbrev(option.abrev);
                                return option.nombre_ubigeo;
                            }}
                            fullWidth
                            value={datosAuto.departamento}
                            onChange={changeDepart}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Departamento" 
                                    variant="filled" 
                                    className='blueFieldTxt' 
                                    {...register("preciudad")} 
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.preprovincia ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="preprovincia"
                            name="preprovincia"
                            options={provinciasState}
                            getOptionLabel={(option) => option.nombre_ubigeo}
                            fullWidth
                            onChange={changeProv}
                            value={datosAuto.provincia}
                            disabled={selectDepart ? false : true }
                            renderInput={(params) => (
                            <TextField 
                                {...params} 
                                label="Provincia" 
                                variant="filled" 
                                {...register("preprovincia")} 
                            />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.predistrito ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="predistrito"
                            name="predistrito"
                            options={distritoState}
                            getOptionLabel={(option) => option.nombre_ubigeo}
                            fullWidth
                            value={datosAuto.distrito}
                            onChange={changeDist}
                            disabled={provinciasState ? false : true }
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Distrito" 
                                    variant="filled" 
                                    {...register("predistrito")} 
                                    error={errors.predistrito ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.preservice ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="preservice"
                            name="preservice"
                            options={servList}
                            getOptionLabel={(option) => {
                                return option.name;
                            }}
                            fullWidth
                            value={datosAuto.servList}
                            onChange={(event,value)=>{
                                setDatosAuto({
                                    ...datosAuto,
                                    servList:value
                                });
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Servicios:" 
                                    variant="filled" 
                                    {...register("preservice")} 
                                    error={errors.preservice ? true : false}
                                />
                            )}
                        />
                    </Grid>

                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.pretipprod ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite ' }
                    >
                        <Autocomplete
                            disablePortal
                            id="pretipprod"
                            name="pretipprod"
                            options={tipoProdList}
                            getOptionLabel={(option) => option.name}
                            fullWidth
                            value={datosAuto.tipoProdList}
                            onChange={(event,value)=>{
                                setDatosAuto({
                                    ...datosAuto,
                                    tipoProdList:value
                                });
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Tipo de producto:" 
                                    variant="filled" 
                                    {...register("pretipprod")} 
                                    error={errors.pretipprod ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={'textField textFieldWhite' }
                    >
                        <div className="preprensaImg">
                            {imgDesign &&
                                <img src={ imgDesign } alt="" />
                            }
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                fullWidth
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Adjuntar diseño
                                <VisuallyHiddenInput
                                    id="preadjdi" 
                                    name="preadjdi"
                                    type="file"
                                    onChange={(event) => {
                                        setImgDesign(URL.createObjectURL(event.target.files[0]))
                                    }}
                                />
                            </Button>
                        </div>
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 8, }}
                        className={errors.predettrab ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' }
                    >
                        <TextField
                            id="predettrab" 
                            name="predettrab"
                            variant="filled" 
                            onChange={changeField}
                            {...register("predettrab")}
                            error={errors.predettrab ? true : false}
                            label="Especificar detalles del trabajo"
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

export default ServFormPreprensa;
