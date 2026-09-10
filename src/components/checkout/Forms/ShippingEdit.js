import { useState, useCallback,useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import StorefrontIcon from '@mui/icons-material/Storefront';

import icoMarquer from '../../../assets/img/ico_marquer.png';

import deparList from '../../../assets/js/departamentos.json';
import distritoList from '../../../assets/js/distritos.json';
import provList from '../../../assets/js/provincias.json';

import Autocomplete from '@mui/material/Autocomplete';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';

import './Shipping.scss'

import icoMarker  from '../../../assets/img/ico_marker.png';
import axios from 'axios';
import { useAuthContext } from './../../../context/authContext';
import { 
    APIProvider,
    InfoWindow,
    Map,
    AdvancedMarker,
    useAdvancedMarkerRef
  } from '@vis.gl/react-google-maps';

const CheckoutFormShippingEdit = ({nextForm,backForm,stepData,setStepData,setEditShip,setShippingData}) => {

    const [ fieldBody, setFieldBody ] = useState({});
    const { token, baseUrl, keysWc, setDeliveryDep } = useAuthContext();
    const [ userData, setUserData ] = useState();

    const changeField = (e) =>{
        setFieldBody({
            ...fieldBody,
            [e.target.name]: e.target.value
        })
    }


    const [selectDepart, setSelectDepart] = useState('');
    const [provinciasState,setProviciasState] = useState('');
    const [distritoState,setDistritoState] = useState('');
    const [datosAuto,setDatosAuto] = useState({
        pais:null,
        departamento:null,
        provincia:null,
        distrito:null
    });

    const changeDepart = (event,value) => {
        setSelectDepart(value.id_ubigeo)
        if(value === null || value.id_ubigeo === null  ){
            setProviciasState(provList["3926"]);    
        }else{
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
        setDeliveryDep(value.nombre_ubigeo);
        if(value === null || value.id_ubigeo === null  ){
            setDistritoState(distritoList["3927"]);    
        }else{
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
        });
    };

    const validationSchema = Yup.object().shape({
        cciudad: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        cprovincia: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        cdistrito: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        csaddess: Yup
                    .string()
                    .when("cprovincia", {
                        is: (cprovincia)=> cprovincia === "Lima" || cprovincia === "Callao",
                        then:()=> Yup.string().required("Ingrese su nombre por favor.").min(2).max(250)
                    }),
        csaddessnum: Yup
                    .string()
                    .when("cprovincia", {
                        is: (cprovincia)=> cprovincia === "Lima" || cprovincia === "Callao",
                        then:()=> Yup.string().required("Ingrese su nombre por favor.").min(2).max(250)
                    }),
        csdpto: Yup
                    .string()
                    .when("cprovincia", {
                        is: (cprovincia)=> cprovincia === "Lima" || cprovincia === "Callao",
                        then:()=> Yup.string()
                    }),
        csref: Yup
                    .string()
                    .when("cprovincia", {
                        is: (cprovincia)=> cprovincia === "Lima" || cprovincia === "Callao",
                        then:()=> Yup.string()
                    }),
        csrecib: Yup.string(),
        csrecibnom: Yup
                    .string()
                    .when("csrecib", {
                        is: (csrecib)=> csrecib === "otro",
                        then: (echema)=>Yup.string().required("Ingrese su nombre por favor.").min(1).max(250)
                    }),
        csrecib2: Yup.string(),
        csdestinatario: Yup
                    .string()
                    .when("csrecib2", {
                        is: (csrecib2)=> csrecib2 === "otro",
                        then: (echema)=>Yup.string().required("Ingrese su nombre por favor.").min(1).max(250)
                    }),
        csotrotelefono: Yup
                    .string()
                    .when("csrecib2", {
                        is: (csrecib2)=> csrecib2 === "otro",
                        then: (echema)=>Yup.string().required("Ingrese su nombre por favor.").min(6).max(15)
                    }),
        csotrodoc: Yup
                    .string()
                    .when("csrecib2", {
                        is: (csrecib2)=> csrecib2 === "otro",
                        then: (echema)=>Yup.string().required("Ingrese su nombre por favor.").min(8).max(9),
                    }),
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
    });

    const [delivery,setDelivery]  = useState(0);
    const changeDel = (val)=>{
        setDelivery(val);
        setEditShip(false);
        setStepData({...stepData,envio:{type:val}});
    }
    
    const [depAbrev,setDepAbrev]  = useState();
    
    const [loadForm,setLoadForm] = useState(false);
    const onSubmit = (data) => {
        setLoadForm(true);
        
        data.cciudad = datosAuto.departamento.nombre_ubigeo;
        data.cprovincia = datosAuto.provincia.nombre_ubigeo;
        data.cdistrito = datosAuto.distrito.nombre_ubigeo;
        console.log('===>',data)

        axios.put(baseUrl+'wp-json/wc/v3/customers/'+userData.user.id+'?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs,
            {
                shipping: {
                    state: depAbrev,
                    city:data.cciudad,
                    address_1: data.csaddess + ' - ' + data.csaddessnum + ' - ' + data.csdpto,
                    address_2: data.csref,
                    country:'PE'
                },
                meta_data:[
                    {
                        id: 1,
                        key: 'wc_user_distrito',
                        value: data.cdistrito
                    },
                    {
                        id: 2,
                        key: 'wc_user_avenida',
                        value: data.csaddess
                    },
                    {
                        id: 3,
                        key: 'wc_user_ndireccion',
                        value: data.csaddessnum
                    },
                    {
                        id: 4,
                        key: 'wc_user_pisooficina',
                        value: data.csdpto
                    },
                    {
                        id: 5,
                        key: 'wc_user_dirreferencias',
                        value: data.csref
                    },
                    
                    {
                        id: 6,
                        key: 'wc_user_otronomape',
                        value: data.csrecibnom
                    },


                    {
                        id: 7,
                        key: 'wc_user_otro2destinatario',
                        value: data.csdestinatario
                    },
                    {
                        id: 8,
                        key: 'wc_user_otro2telefono',
                        value: data.csotrotelefono
                    },
                    {
                        id: 8,
                        key: 'wc_user_otro2dni',
                        value: data.csotrodoc
                    },
                ]
            }).then((resp)=>{
                //console.log('=================>',resp);
                setShippingData(data);
                nextForm(2);
                setLoadForm(false);
                setStepData({...stepData,envio:{type:delivery,data:data}})
                setEditShip(false);
            }).catch((err)=>{
                //console.log(err)
                setLoadForm(false);
            })
    }


    // Google map
    const [markerRef, marker] = useAdvancedMarkerRef();

    const [infoWindowShown, setInfoWindowShown] = useState(true);

    // clicking the marker will toggle the infowindow
    const handleMarkerClick = useCallback(
        () => setInfoWindowShown(isShown => !isShown),
        []
    );

    // if the maps api closes the infowindow, we have to synchronize our state
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    useEffect(()=>{
        if(token){
            setUserData(token)
        }



    },[])

    useEffect(() => {
        if(stepData.envio && stepData.envio.data){
            const depTmp  = deparList.find(dep => dep.nombre_ubigeo === stepData.envio.data.cciudad)
            changeDepart(null,depTmp);

            const provTmp  = provList[depTmp.id_ubigeo].find(prov => prov.nombre_ubigeo === stepData.envio.data.cprovincia);
            changeProv(null,provTmp);
            
            const distTmp = distritoList[provTmp.id_ubigeo].find(dist => dist.nombre_ubigeo === stepData.envio.data.cdistrito);
            changeDist(null,distTmp)

            if(stepData.envio.data.csrecib2 === 'otro'){
                setFieldBody({
                    ...fieldBody,
                    csrecib2:stepData.envio.data.csrecib2,
                    csdestinatario:stepData.envio.data.csdestinatario,
                    csotrotelefono:stepData.envio.data.csotrotelefono,
                    csotrodoc:stepData.envio.data.csotrodoc,
                })
            }

            if(provTmp.id_ubigeo === '3927' ||  provTmp.id_ubigeo === '3285'){
                if(stepData.envio.data.csrecib === 'otro'){
                    setFieldBody({
                        ...fieldBody,
                        csaddess:stepData.envio.data.csaddess,
                        csaddessnum:stepData.envio.data.csaddessnum,
                        csdpto:stepData.envio.data.csdpto,
                        csref:stepData.envio.data.csref,
                        csrecib:stepData.envio.data.csrecib,
                        csrecibnom:stepData.envio.data.csrecibnom
                    })
                    //setRdoOtro(stepData.envio.data.csrecib)
                }else{
                    setFieldBody({
                        ...fieldBody,
                        csaddess:stepData.envio.data.csaddess,
                        csaddessnum:stepData.envio.data.csaddessnum,
                        csdpto:stepData.envio.data.csdpto,
                        csref:stepData.envio.data.csref,
                    })
                }
            }

            setDatosAuto({
                ...datosAuto,
                departamento:depTmp,
                provincia:provTmp,
                distrito:distTmp
            });


            const cargarDatos = async () => {
                reset({
                    cciudad: depTmp,
                    cprovincia: provTmp,
                    cdistrito: distTmp,
                    csaddess: stepData.envio.data.csaddess,
                    csaddessnum: stepData.envio.data.csaddessnum,
                    csdpto: stepData.envio.data.csdpto,
                    csref: stepData.envio.data.csref,
                    csrecib: stepData.envio.data.csrecib,
                    csrecibnom: stepData.envio.data.csrecibnom,
                    csrecib2: stepData.envio.data.csrecib2,
                    csdestinatario: stepData.envio.data.csdestinatario,
                    csotrotelefono: stepData.envio.data.csotrotelefono,
                    csotrodoc: stepData.envio.data.csotrodoc
                });
            };


            cargarDatos();
        }



    }, [reset]);

    return (
        <div className="inlineFlex checoStepperBox">
            <div className="inlineFlex checoStepperResp">

                <div className={'checkoutFormDelivery'}>
                    <div className="inlineFlex cfdList">
                        <div onClick={()=>changeDel(0)} className={delivery === 0 ? 'cfdItem cfdItemAct' : 'cfdItem'}>
                            <span><DeliveryDiningIcon/>Envío a Domicilio</span>
                            <div className="iconCheck"></div>
                        </div>
                        <div onClick={()=>changeDel(1)} className={delivery === 1 ? 'cfdItem cfdItemAct' : 'cfdItem'}>
                            <div className="iconCheck"></div>
                            <span><StorefrontIcon/>Recojo en Tienda</span>
                            <div className="iconCheck"></div>
                        </div>
                    </div>
                    {delivery === 0 ?
                        <div className="inlineBlock cfdListResp">
                            <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    
                                    <Grid 
                                        className={errors.cciudad ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' } 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 6, }}
                                    >
                                        <Autocomplete
                                            disablePortal
                                            variant='filled'
                                            id="cciudad"
                                            name="cciudad"
                                            options={deparList}
                                            getOptionLabel={(option) => option.nombre_ubigeo}
                                            fullWidth
                                            //defaultValue={deparList.find(dep => dep.nombre_ubigeo === datosAuto.departamento)}
                                            //value={datosAuto.departamento}
                                            value={datosAuto.departamento}
                                            onChange={(event, newValue) => {
                                                changeDepart(event, newValue);
                                                console.log(newValue)
                                                if (newValue) setDepAbrev(newValue.abrev); // 👈 mover aquí
                                            }}
                                            renderInput={(params) => (
                                                <TextField 
                                                    {...params} 
                                                    label="Departamento" 
                                                    variant="filled" 
                                                    className='blueFieldTxt' 
                                                    {...register("cciudad")} 
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid 
                                        className={errors.cprovincia ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' } 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 6, }}
                                    >
                                        <Autocomplete
                                            disablePortal
                                            id="cprovincia"
                                            name="cprovincia"
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
                                                {...register("cprovincia")} 
                                            />
                                            )}
                                        />
                                    </Grid>

                                    <Grid 
                                        className={errors.cdistrito ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' } 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                    >
                                        <Autocomplete
                                            disablePortal
                                            id="cdistrito"
                                            name="cdistrito"
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
                                                {...register("cdistrito")} 
                                                error={errors.cdistrito ? true : false}
                                            />
                                            )}
                                        />
                                    </Grid>
                                    { 
                                        // Lima y callao ubigeos ==> "3927" "3285"
                                    }

                                    {(() => {

                                        if(datosAuto.provincia){
                                            if(datosAuto.provincia.id_ubigeo === '3927' ||  datosAuto.provincia.id_ubigeo === '3285'){
                                                return (
                                                    <Grid container spacing={2}>

                                                        <Grid 
                                                            className={errors.csaddess ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' } 
                                                            item 
                                                            size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <TextField 
                                                                label="Avenida/Calle/Jirón/Manzana" 
                                                                variant="filled" 
                                                                name="csaddess"
                                                                id="csaddess"
                                                                fullWidth
                                                                defaultValue={fieldBody.csaddess}
                                                                onChange={changeField}
                                                                {...register("csaddess")}
                                                            />
                                                        </Grid>

                                                        <Grid 
                                                            className={errors.csaddessnum ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' } 
                                                            item 
                                                            size={{ xs: 12, sm: 12, md: 6 }}>
                                                            <TextField 
                                                                label="Número de la dirección" 
                                                                variant="filled" 
                                                                name="csaddessnum"
                                                                id="csaddessnum"
                                                                fullWidth
                                                                defaultValue={fieldBody.csaddessnum}
                                                                onChange={changeField}
                                                                {...register("csaddessnum")}
                                                            />
                                                        </Grid>

                                                        <Grid 
                                                            className={errors.csdpto ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' }
                                                            item 
                                                            size={{ xs: 12, sm: 12, md: 6 }}>
                                                            <TextField 
                                                                label="Dpto, Piso, oficina (Opcional)" 
                                                                variant="filled" 
                                                                name="csdpto"
                                                                id="csdpto"
                                                                fullWidth
                                                                defaultValue={fieldBody.csdpto}
                                                                onChange={changeField}
                                                                {...register("csdpto")}
                                                                error={errors.csdpto ? true : false}
                                                            />
                                                        </Grid>

                                                        <Grid 
                                                            className={errors.csref ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' }
                                                            item 
                                                            size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <TextField 
                                                                label="Referencia" 
                                                                variant="filled" 
                                                                name="csref"
                                                                id="csref"
                                                                fullWidth
                                                                defaultValue={fieldBody.csref}
                                                                onChange={changeField}
                                                                {...register("csref")}
                                                                error={errors.csref ? true : false}
                                                            />
                                                        </Grid>

                                                        <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <FormControl>
                                                                <FormLabel id="demo-radio-buttons-group-label2">Métodos de envío</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label2"
                                                                    defaultValue="female"
                                                                    name="radio-buttons-group"
                                                                >
                                                                    <FormControlLabel 
                                                                        value="female" 
                                                                        control={<Radio />} 
                                                                        label={ 
                                                                            <p> Agregar costo delivery</p>
                                                                        }
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <FormControl>
                                                                <FormLabel id="csrecib-lav">¿Quien recibirá tu compra?</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="csrecib-lav"
                                                                    id="csrecib"
                                                                    defaultValue={fieldBody.csrecib ? fieldBody.csrecib: 'yo' }
                                                                    value={fieldBody.csrecib}
                                                                >
                                                                    <FormControlLabel 
                                                                        value="yo" 
                                                                        {...register("csrecib")}
                                                                        onChange={changeField}
                                                                        control={<Radio/>} 
                                                                        label="Yo recibiré mi compra" 
                                                                        
                                                                    />
                                                                    <FormControlLabel 
                                                                        value="otro"
                                                                        {...register("csrecib")}
                                                                        onChange={changeField}
                                                                        control={<Radio/>} 
                                                                        label="Otro"
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>

                                                        {fieldBody.csrecib === 'otro' &&
                                                            <Grid 
                                                                className={errors.csrecibnom ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite textFieldWhiteError' }
                                                                item 
                                                                size={{ xs: 12, sm: 12, md: 12 }}
                                                            >
                                                                <TextField 
                                                                    label="Nombres y apellidos" 
                                                                    variant="filled" 
                                                                    name="csrecibnom"
                                                                    id="csrecibnom"
                                                                    fullWidth
                                                                    defaultValue={fieldBody.csrecibnom}
                                                                    onChange={changeField}
                                                                    {...register("csrecibnom")}
                                                                    error={errors.csdestinatario ? true : false}
                                                                />
                                                            </Grid>
                                                        }
                                                    </Grid>
                                                )
                                            }else{
                                                return (
                                                    <Grid container spacing={2}>
                                                        <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <FormControl>
                                                                <FormLabel id="demo-radio-buttons-group-label" onClick={()=>console.log('-.----.....>',fieldBody.csrecib2)}>¿Quien recibirá tu compra?</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                                    defaultValue={fieldBody.csrecib2 ? fieldBody.csrecib2: 'yo' }
                                                                    value={fieldBody.csrecib2}
                                                                >
                                                                    <FormControlLabel 
                                                                        value="yo" 
                                                                        {...register("csrecib2")}
                                                                        onChange={changeField}
                                                                        control={<Radio/>} 
                                                                        label="Yo recibiré mi compra" 
                                                                    />
                                                                    <FormControlLabel 
                                                                        value="otro"
                                                                        {...register("csrecib2")}
                                                                        onChange={changeField}
                                                                        control={<Radio/>} 
                                                                        label="Otro"
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                        {fieldBody.csrecib2 === 'otro' &&
                                                            
                                                            <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 12 }}>
                                                                <TextField 
                                                                    label="Destinatario" 
                                                                    variant="filled" 
                                                                    name="csdestinatario"
                                                                    id="csdestinatario"
                                                                    defaultValue={fieldBody.csdestinatario}
                                                                    fullWidth
                                                                    onChange={changeField}
                                                                    {...register("csdestinatario")}
                                                                    error={errors.csdestinatario ? true : false}
                                                                />
                                                            </Grid>
                                                            
                                                        }
                                                        {fieldBody.csrecib2 === 'otro' &&
                                                            
                                                            <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 6 }}>
                                                                <TextField 
                                                                    label="N° Celular:" 
                                                                    variant="filled" 
                                                                    name="csotrotelefono"
                                                                    type={'tel'}
                                                                    defaultValue={fieldBody.csotrotelefono}
                                                                    fullWidth
                                                                    id="csotrotelefono"
                                                                    onChange={changeField}
                                                                    {...register("csotrotelefono")}
                                                                    error={errors.csotrotelefono ? true : false}
                                                                />
                                                            </Grid>
                                                            
                                                        }
                                                        {fieldBody.csrecib2 === 'otro' &&
                                                            
                                                            <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 6 }}>
                                                                <TextField 
                                                                    label="Doc. de identidad:" 
                                                                    variant="filled" 
                                                                    name="csotrodoc"
                                                                    type={'number'}
                                                                    fullWidth
                                                                    id="csotrodoc"
                                                                    defaultValue={fieldBody.csotrodoc}
                                                                    onChange={changeField}
                                                                    {...register("csotrodoc")}
                                                                    error={errors.csotrodoc ? true : false}
                                                                />
                                                            </Grid>
                                                            
                                                        }
                                                        <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                                                            <FormControl>
                                                                <FormLabel id="demo-radio-buttons-group-label2">Métodos de envío:</FormLabel>
                                                                <RadioGroup
                                                                    aria-labelledby="demo-radio-buttons-group-label2"
                                                                    defaultValue="female"
                                                                    name="radio-buttons-group"
                                                                >
                                                                    <FormControlLabel value="female" control={<Radio />} 
                                                                        label={ <p> Coordinar envío <Tooltip 
                                                                                className='tooltipShipingTxt'
                                                                                placement="right-start"
                                                                                //title="El pago en destino. Comunicarse con el encargado de ventas para coordinar la agencia de envío"
                                                                                title="Pago en destino. Comunicarse via whatsapp para coordinar la agencia de envío."
                                                                            >
                                                                                <InfoIcon></InfoIcon></Tooltip>
                                                                            </p>
                                                                            } 
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                )
                                            }
                                        }
                                    })()}
                                    <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                                        {loadForm ?
                                            <div className="inlineFlex checoStepperBtn">
                                                <div className="btnPrimary">
                                                    <CircularProgress color={'whit'} size={20} />
                                                </div>
                                                <div className={'btnPrimary btnPrimaryBack'}
                                                    onClick={backForm}
                                                >
                                                    Volver
                                                </div>
                                            </div>
                                        :
                                            <div className="inlineFlex checoStepperBtn">
                                                <button className="btnPrimary">
                                                    Siguiente
                                                </button>
                                                <button className={'btnPrimary btnPrimaryBack'}
                                                    onClick={backForm}
                                                >
                                                    Volver
                                                </button>
                                            </div>
                                        }
                                    </Grid>

                                </Grid>
                            </form>
                        </div>
                    :
                        <div className="inlineBlock cfdListResp">
                            <div className="storeDelivery">
                                <div className="inlineFlex storeDeliveryDir">
                                    <img src={icoMarquer} alt="" />
                                    <div className="txt">
                                        <h4>Comas, Lima, Perú</h4>
                                        <p>Av. Chillon Nro. 236 Z.I. Ex Fundo Chacra Cerro</p>
                                    </div>
                                </div>
                                <div className="inlineFlex cfdMap">
                                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                                        <Map
                                            mapId={'bf51a910020fa2asda5a'}
                                            defaultZoom={13}
                                            defaultCenter={{lat: -11.915864231668476, lng: -77.04791280206123}}
                                            gestureHandling='greedy'
                                            disableDefaultUI>
                                            <AdvancedMarker 
                                                ref={markerRef}
                                                position={{lat: -11.919010080885704, lng: -77.06847974585591}} 
                                                onClick={handleMarkerClick}
                                            >
                                                <img src={icoMarker} width={20} height={35} /> 

                                            </AdvancedMarker>

                                            {infoWindowShown && (
                                                <InfoWindow anchor={marker} onClose={handleClose} maxWidth={200}>
                                                    <div className="inlineBlock encuentInfowindow">
                                                        <h2>Asdimor</h2>
                                                        <p>Av. Chillon Nro. 236 Z.I. Ex Fundo Chacra Cerro</p>
                                                    </div>
                                                </InfoWindow>
                                            )}

                                        </Map>
                                    </APIProvider>
                                </div>
                            </div>

                            {loadForm ?
                                <div className="inlineFlex checoStepperBtn">
                                    <div 
                                        className="btnPrimary"
                                        onClick={nextForm}
                                    >
                                        <CircularProgress color={'whit'} size={20} />
                                    </div>
                                    <div className={'btnPrimary btnPrimaryBack btnDisabled'}
                                        onClick={backForm}
                                    >
                                        Volver
                                    </div>
                                </div>
                            :
                                <div className="inlineFlex checoStepperBtn">
                                    <button 
                                        className="btnPrimary"
                                        onClick={nextForm}
                                    >
                                        Siguiente
                                    </button>
                                    <button className={'btnPrimary btnPrimaryBack'}
                                        onClick={backForm}
                                    >
                                        Volver
                                    </button>
                                </div>
                            }
                        </div>
                    }
                </div>

            </div>
        </div>
    )
};

export default CheckoutFormShippingEdit;
