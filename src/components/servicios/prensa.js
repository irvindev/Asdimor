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

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

const ServFormPrensa = ({handleClose}) => {

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
        pagesList: null,

        formatList: null,
        colorList: null,
        papelIntList: null,

        cubiertaList: null,
        papelTapas: null,
        laminadoList: null,
        encList: null,
    });

    const tipoProdList = [
        {id:1, name:'Libros'},
        {id:2, name:'Revistas'},
        {id:3, name:'Cuadernos corporativos'},
        {id:4, name:'Cuadernos promocionales'},
        {id:5, name:'Papelería corporativa'},
        {id:6, name:'Material promocional'},
        {id:7, name:'Volantes'}
    ]

    const pagesList = [
        {id:1, name:'Multiplo 8'},
        {id:2, name:'Multiplo 9'},
        {id:3, name:'Multiplo 10'},
    ]

    const formatList = [
        {id:1, name:'A4 (21x29.7 cm)'},
        {id:2, name:'A5 (14.5 x 20.5 cm)'},
        {id:3, name:'A6 (10 x 14.5 cm)'},
        {id:4, name:'B5 (17.5 x 24.5 cm)'},
        {id:5, name:'B6 (12.0 x 17.5 cm)'}
    ]

    const colorList =[
        {id:1, name:'1 color'},
        {id:2, name:'2 color'},
        {id:3, name:'4 color'},
    ]

    const papelIntList = [
        {id:1, name:'Bond 56 g'},
        {id:2, name:'Bond 70 g'},
        {id:3, name:'Bond 75 g'},
        {id:4, name:'Couché 90 g'},
        {id:5, name:'Couché 115 g'},
        {id:6, name:'Couché 250 g'},
        {id:7, name:'Papel Adhesivo'}
    ]

    const cubiertaList = [
        {id:1, name:'Flexible'},
        {id:2, name:'Tapa dura'}
    ]

    const papelTapas = [
        {id:1, name:'Duplex/Foldcote'},
        {id:2, name:'Couché 115 g'},
        {id:3, name:'Couché 250 g'},
        {id:4, name:'Couché 300 g'}
    ]

    const laminadoList = [
        {id:1, name:'Laminado brillo'},
        {id:2, name:'Laminado mate'},
        {id:3, name:'Sin laminado'},
    ]

    const encList = [
        {id:1, name:'Cola caliente'},
        {id:2, name:'Cocido'},
        {id:3, name:'Engrapado'},
        {id:4, name:'Doble ring'},
        {id:5, name:'Espiralado'},
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
        prennombre: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prentelefono: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prencorreo: Yup.string().email().required(),
        prenciudad: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenprovincia: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prendistrito: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenProdList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenCant: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),

        prenPagesList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenFormatList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenColorList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenPapelIntList: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        prenAddAcabados:Yup.boolean(),

        prenCubiertaList: Yup
            .string().when("prenAddAcabados", {
                is: true,
                then:(schema)=> Yup.string().min(2).max(250).required("Required")
            }),
        prenPapelTapasList: Yup
            .string().when("prenAddAcabados", {
                is: true,
                then:(schema)=> Yup.string().min(2).max(250).required("Required")
            }),
        prenLaminadoList: Yup
            .string().when("prenAddAcabados", {
                is: true,
                then:(schema)=> Yup.string().min(2).max(250).required("Required")
            }),
        prenEncuadList: Yup
            .string().when("prenAddAcabados", {
                is: true,
                then:(schema)=> Yup.string().min(2).max(250).required("Required")
            }),
        prendettrab: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),

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

    const [imgDesign,setImgDesign] = useState();

    const onSubmit = (data) => {
        //console.log(data);
        setLoadForm(true)
        const emailBody = {
            "nombres": data.prennombre,
            "telefono": data.prentelefono,
            "correo": data.prencorreo,
            "departamento": data.prenciudad,
            "provincia": data.prenprovincia,
            "distrito": data.prendistrito,
            "tipo_prod": data.prenProdList,
            "cantidad": data.prenCant,
            "n_pag": data.prenPagesList,
            "formato": data.prenFormatList,
            "color": data.prenColorList,
            "papel_int": data.prenPapelIntList,
            "agregar_acabados": data.prenAddAcabados,
            "cubierta": data.prenCubiertaList,
            "papel_tapa": data.prenPapelTapasList,
            "laminado": data.prenLaminadoList,
            "encuadernacion": data.prenEncuadList,
            "mensaje": data.prendettrab,
            "diseno": imgDesign ? imgDesign : null,

            "_wpcf7_unit_tag": "4bc54d3"
        };

        
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/892/feedback',form).then((resp)=>{
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
                        <h3>Prensa</h3>
                    </Grid>
                
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.prennombre ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prennombre" 
                            name="prennombre"
                            label="Nombres completos:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("prennombre")}
                            error={errors.prennombre ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 6, }}
                        className={errors.prentelefono ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prentelefono" 
                            name="prentelefono"
                            label="Teléfono:" 
                            type={'number'}
                            variant="filled" 
                            onChange={changeField}
                            {...register("prentelefono")}
                            error={errors.prentelefono ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={errors.prencorreo ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prencorreo" 
                            name="prencorreo"
                            label="Correo:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("prencorreo")}
                            error={errors.prencorreo ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenciudad ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            variant='filled'
                            id="prenciudad"
                            name="prenciudad"
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
                                    {...register("prenciudad")} 
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenprovincia ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prenprovincia"
                            name="prenprovincia"
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
                                {...register("prenprovincia")} 
                            />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prendistrito ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prendistrito"
                            name="prendistrito"
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
                                    {...register("prendistrito")} 
                                    error={errors.prendistrito ? true : false}
                                />
                            )}
                        />
                    </Grid>

                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenProdList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prenProdList"
                            name="prenProdList"
                            options={tipoProdList}
                            getOptionLabel={(option) => {
                                return option.name;
                            }}
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
                                    label="Tipo producto:" 
                                    variant="filled" 
                                    {...register("prenProdList")} 
                                    error={errors.prenProdList ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenCant ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prenCant" 
                            name="prenCant"
                            label="Cantidad:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("prenCant")}
                            error={errors.prenCant ? true : false}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenPagesList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <TextField 
                            fullWidth 
                            id="prenPagesList" 
                            name="prenPagesList"
                            label="N° Páginas:" 
                            variant="filled" 
                            onChange={changeField}
                            {...register("prenPagesList")}
                            error={errors.prenPagesList ? true : false}
                        />
                    </Grid>

                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenFormatList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prenFormatList"
                            name="prenFormatList"
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
                                    label="Formato cerrado:" 
                                    variant="filled" 
                                    {...register("prenFormatList")} 
                                    error={errors.prenFormatList ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenColorList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prenColorList"
                            name="prenColorList"
                            options={colorList}
                            getOptionLabel={(option) => {
                                return option.name;
                            }}
                            fullWidth
                            value={datosAuto.colorList}
                            onChange={(event,value)=>{
                                setDatosAuto({
                                    ...datosAuto,
                                    colorList:value
                                });
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Color:" 
                                    variant="filled" 
                                    {...register("prenColorList")} 
                                    error={errors.prenColorList ? true : false}
                                />
                            )}
                        />
                    </Grid>
                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 4, }}
                        className={errors.prenPapelIntList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                    >
                        <Autocomplete
                            disablePortal
                            id="prenPapelIntList"
                            name="prenPapelIntList"
                            options={papelIntList}
                            getOptionLabel={(option) => {
                                return option.name;
                            }}
                            fullWidth
                            value={datosAuto.papelIntList}
                            onChange={(event,value)=>{
                                setDatosAuto({
                                    ...datosAuto,
                                    papelIntList:value
                                });
                            }}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Papel Interior:" 
                                    variant="filled" 
                                    {...register("prenPapelIntList")} 
                                    error={errors.prenPapelIntList ? true : false}
                                />
                            )}
                        />
                    </Grid>

                    <Grid 
                        item 
                        size={{ xs: 12, sm: 12, md: 12, }}
                        className={'textField textFieldWhite' } 
                    >
                        <FormGroup>
                            <FormControlLabel 
                                control={
                                    <Checkbox 
                                        name={'prenAddAcabados'}
                                        value={fieldBody.prenAddAcabados} 
                                        {...register("prenAddAcabados")}
                                        onChange={changeField}
                                    />
                                } 
                                label="Añadir acabados" 
                            />
                        </FormGroup>
                    </Grid>
                    
                    {fieldBody.prenAddAcabados === true &&
                        <Grid 
                            item 
                            size={{ xs: 12, sm: 12, md: 6, }}
                            className={errors.prenCubiertaList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                        >
                            <Autocomplete
                                disablePortal
                                id="prenCubiertaList"
                                name="prenCubiertaList"
                                options={cubiertaList}
                                getOptionLabel={(option) => {
                                    return option.name;
                                }}
                                fullWidth
                                value={datosAuto.cubiertaList}
                                onChange={(event,value)=>{
                                    setDatosAuto({
                                        ...datosAuto,
                                        cubiertaList:value
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Cubierta:" 
                                        variant="filled" 
                                        {...register("prenCubiertaList")} 
                                        error={errors.prenCubiertaList ? true : false}
                                    />
                                )}
                            />
                        </Grid>
                    }

                    {fieldBody.prenAddAcabados === true &&
                        <Grid 
                            item 
                            size={{ xs: 12, sm: 12, md: 6, }}
                            className={errors.prenPapelTapasList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                        >
                            <Autocomplete
                                disablePortal
                                id="prenPapelTapasList"
                                name="prenPapelTapasList"
                                options={papelTapas}
                                getOptionLabel={(option) => {
                                    return option.name;
                                }}
                                fullWidth
                                value={datosAuto.papelTapas}
                                onChange={(event,value)=>{
                                    setDatosAuto({
                                        ...datosAuto,
                                        papelTapas:value
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Papel Tapas:" 
                                        variant="filled" 
                                        {...register("prenPapelTapasList")} 
                                        error={errors.prenPapelTapasList ? true : false}
                                    />
                                )}
                            />
                        </Grid>
                    }

                    {fieldBody.prenAddAcabados === true &&
                        <Grid 
                            item 
                            size={{ xs: 12, sm: 12, md: 6, }}
                            className={errors.prenLaminadoList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                        >
                            <Autocomplete
                                disablePortal
                                id="prenLaminadoList"
                                name="prenLaminadoList"
                                options={laminadoList}
                                getOptionLabel={(option) => {
                                    return option.name;
                                }}
                                fullWidth
                                value={datosAuto.laminadoList}
                                onChange={(event,value)=>{
                                    setDatosAuto({
                                        ...datosAuto,
                                        laminadoList:value
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Laminado:" 
                                        variant="filled" 
                                        {...register("prenLaminadoList")} 
                                        error={errors.prenLaminadoList ? true : false}
                                    />
                                )}
                            />
                        </Grid>
                    }

                    {fieldBody.prenAddAcabados === true &&
                        <Grid 
                            item 
                            size={{ xs: 12, sm: 12, md: 6, }}
                            className={errors.prenEncuadList ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                        >
                            <Autocomplete
                                disablePortal
                                id="prenEncuadList"
                                name="prenEncuadList"
                                options={encList}
                                getOptionLabel={(option) => {
                                    return option.name;
                                }}
                                fullWidth
                                value={datosAuto.encList}
                                onChange={(event,value)=>{
                                    setDatosAuto({
                                        ...datosAuto,
                                        encList:value
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Encuadernación:" 
                                        variant="filled" 
                                        {...register("prenEncuadList")} 
                                        error={errors.prenEncuadList ? true : false}
                                    />
                                )}
                            />
                        </Grid>
                    }


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
                                    id="prenadjdi" 
                                    name="prenadjdi"
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
                        className={errors.prendettrab ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' }
                    >
                        <TextField
                            id="prendettrab" 
                            name="prendettrab"
                            variant="filled" 
                            onChange={changeField}
                            {...register("prendettrab")}
                            error={errors.prendettrab ? true : false}
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

export default ServFormPrensa;
