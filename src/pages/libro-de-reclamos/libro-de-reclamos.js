import {useState} from "react";
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

import './libro-de-reclamos.scss';

import Container from '@mui/material/Container';

import TextField from '@mui/material/TextField';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import deparList from '../../assets/js/departamentos.json';
import distritoList from '../../assets/js/distritos.json';
import provList from '../../assets/js/provincias.json';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Autocomplete from '@mui/material/Autocomplete';

import Grid from '@mui/material/Grid';
import { useAuthContext } from './../../context/authContext';
import axios from 'axios';

import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';

import CloseIcon from '@mui/icons-material/Close';

import icoReclamo from '../../assets/img/ico_reclamo.png';

const LibroDeReclamosPage = (props) => {

    const [breadCrumb,setBreadCrumb] = useState([
            {
                name:'Inicio',
                link:'/'
            },
            {
                name:'Libro de reclamos',
            }
    ]);

    const [fieldBody,setFieldBody] = useState({});
    const { baseUrl} = useAuthContext();

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        })
    };

    const validationSchema = Yup.object().shape({
        lrnombres: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrcorreo: Yup.string().email().required(),
        lrtelefono: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrdoctype: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),

        lrnumdoc: Yup.string().required("Ingrese su nombre por favor.").min(6).max(14),
        lrciudad: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrprovincia: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrdistrito: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrdireccion: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrprodserv: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        //lrfecbuy: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        //lrnroboleta: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrmonrec: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrrecque: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrdetalle: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrpedido: Yup.string().required("Ingrese su nombre por favor.").min(2).max(250),
        lrpolpriv: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),

        // Nuevos campos opcionales
        lrmenor: Yup.string().nullable(),
        lrapo_nombre: Yup.string().nullable(),
        lrapo_domicilio: Yup.string().nullable(),
        lrapo_dni: Yup.string().nullable(),
        lrapo_telefono: Yup.string().nullable(),
        lrapo_correo: Yup.string().email("Ingrese un correo válido").nullable(),

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

    const [rdoDocType, setRdoDocType] = useState('DNI');
    const rdoDocTypeChange = (e) => {
        setRdoDocType(e.target.value);
    };

    const [rdoProdServ,setRdoProdServ] = useState();
    const rdoProdServChange = (e)=>{
        setRdoProdServ(e.target.value)
    }

    const [rdoRecQue,rdoSetRecQue] = useState();
    const rdoRecQueChange = (e)=>{
        rdoSetRecQue(e.target.value)
    }

    const [rdoMenorEdad, setRdoMenorEdad] = useState('');

    const rdoMenorEdadChange = (e) => {
        setRdoMenorEdad(e.target.value);
    };

    const [depAbrev,setDepAbrev]  = useState();

    const [ loadForm,setLoadForm] = useState(false);

    const [numeroReclamo, setNumeroReclamo] = useState('');
    const [reclamoData, setReclamoData] = useState(null);

    const escapeHtml = (value) => {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br />');
    };

    const buildReclamoHtml = (d) => {
        const e = escapeHtml;
        return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>Hoja de Reclamación N° ${e(d.correlativo)}</title>
<style>
    @media print {
        @page { margin: 15mm; }
    }
    body { font-family: Arial, Helvetica, sans-serif; }
</style>
</head>
<body>
<div style="font-family: Arial, Helvetica, sans-serif; color: #222; max-width: 900px; margin: 0 auto; font-size: 13px;">
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 12px; text-align: center;" width="65%">
<div style="font-size: 20px; font-weight: bold;">LIBRO DE RECLAMACIONES</div>
<div style="font-size: 16px; margin-top: 5px;">HOJA DE RECLAMACIÓN</div>
</td>
<td style="border: 1px solid #222; padding: 12px; text-align: center; vertical-align: middle;" width="35%">
<div style="font-size: 11px; font-weight: bold;">N.° DE RECLAMACIÓN</div>
<div style="font-size: 16px; font-weight: bold; margin-top: 5px;">${e(d.correlativo)}</div>
</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="50%">FECHA Y HORA</td>
<td style="border: 1px solid #222; padding: 8px;" width="50%">${e(d.fecha)} ${e(d.hora)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">PROVEEDOR</td>
<td style="border: 1px solid #222; padding: 8px;">PUBLICACIONES ASDIMOR S.A.C.</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #333; color: #fff; font-weight: bold;" colspan="2">1. IDENTIFICACIÓN DEL CONSUMIDOR RECLAMANTE</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="25%">NOMBRE</td>
<td style="border: 1px solid #222; padding: 8px;" width="75%">${e(d.lrnombres)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">CORREO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrcorreo)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">TELÉFONO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrtelefono)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">TIPO DE DOCUMENTO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrdoctype)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">NÚMERO DE DOCUMENTO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrnumdoc)}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #e9e9e9; font-weight: bold;" colspan="4">DOMICILIO DEL CONSUMIDOR</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="25%">CIUDAD</td>
<td style="border: 1px solid #222; padding: 8px;" width="25%">${e(d.lrciudad)}</td>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="25%">PROVINCIA</td>
<td style="border: 1px solid #222; padding: 8px;" width="25%">${e(d.lrprovincia)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">DISTRITO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrdistrito)}</td>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">DIRECCIÓN</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrdireccion)}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #333; color: #fff; font-weight: bold;" colspan="4">2. IDENTIFICACIÓN DEL BIEN CONTRATADO</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="25%">PRODUCTO / SERVICIO</td>
<td style="border: 1px solid #222; padding: 8px;" width="25%">${e(d.lrprodserv)}</td>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="25%">MONTO RECLAMADO</td>
<td style="border: 1px solid #222; padding: 8px;" width="25%">S/ ${e(d.lrmonrec)}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #333; color: #fff; font-weight: bold;" colspan="2">3. DETALLE DE LA RECLAMACIÓN Y PEDIDO DEL CONSUMIDOR</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="30%">TIPO</td>
<td style="border: 1px solid #222; padding: 8px;" width="70%">${e(d.lrrecque)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold; vertical-align: top;">DETALLE DE RECLAMO / QUEJA</td>
<td style="border: 1px solid #222; padding: 8px; height: 100px; vertical-align: top; white-space: pre-line;">${e(d.lrdetalle)}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold; vertical-align: top;">PEDIDO DEL CONSUMIDOR</td>
<td style="border: 1px solid #222; padding: 8px; height: 70px; vertical-align: top; white-space: pre-line;">${e(d.lrpedido)}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="30%">AUTORIZACIÓN DE TRATAMIENTO DE DATOS</td>
<td style="border: 1px solid #222; padding: 8px;" width="70%">${d.lrpolpriv ? 'Sí, autorizo' : 'No autoriza'}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">MENOR DE EDAD</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrmenor || 'No')}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 15px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #333; color: #fff; font-weight: bold;" colspan="4">4. DATOS DEL PADRE, MADRE O APODERADO</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="20%">NOMBRE</td>
<td style="border: 1px solid #222; padding: 8px;" width="30%">${e(d.lrapo_nombre || '-')}</td>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;" width="20%">DNI</td>
<td style="border: 1px solid #222; padding: 8px;" width="30%">${e(d.lrapo_dni || '-')}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">DOMICILIO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrapo_domicilio || '-')}</td>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">TELÉFONO</td>
<td style="border: 1px solid #222; padding: 8px;">${e(d.lrapo_telefono || '-')}</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 8px; background: #f2f2f2; font-weight: bold;">CORREO</td>
<td style="border: 1px solid #222; padding: 8px;" colspan="3">${e(d.lrapo_correo || '-')}</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; margin-bottom: 20px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="border: 1px solid #222; padding: 9px; background: #333; color: #fff; font-weight: bold;">5. OBSERVACIONES Y ACCIONES ADOPTADAS POR EL PROVEEDOR</td>
</tr>
<tr>
<td style="border: 1px solid #222; padding: 20px; height: 100px;">&nbsp;</td>
</tr>
</tbody>
</table>
<table style="border-collapse: collapse; font-size: 11px;" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="padding: 8px 0;"><strong>RECLAMO:</strong> Disconformidad relacionada a los productos o servicios.</td>
</tr>
<tr>
<td style="padding: 8px 0;"><strong>QUEJA:</strong> Disconformidad no relacionada a los productos o servicios; o malestar o descontento respecto a la atención al público.</td>
</tr>
<tr>
<td style="padding: 8px 0;">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</td>
</tr>
<tr>
<td style="padding: 8px 0;">El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.</td>
</tr>
</tbody>
</table>
</div>
</body>
</html>`;
    };

    const handleGenerarPDF = () => {
        if (!reclamoData) return;

        const html = buildReclamoHtml(reclamoData);

        const pdfWindow = window.open('', '_blank');

        if (!pdfWindow) {
            return;
        }

        pdfWindow.document.open();
        pdfWindow.document.write(html);
        pdfWindow.document.close();

        setTimeout(() => {
            pdfWindow.focus();
            pdfWindow.print();
        }, 500);
    };

    const onSubmit = (data) => {

        setLoadForm(true);

        const emailBody = {
            "lrnombres": data.lrnombres,
            "lrcorreo": data.lrcorreo,
            "lrtelefono": data.lrtelefono,
            "lrdoctype": data.lrdoctype,
            "lrnumdoc": data.lrnumdoc,
            "lrciudad": data.lrciudad,
            "lrprovincia": data.lrprovincia,
            "lrdistrito": data.lrdistrito,
            "lrdireccion": data.lrdireccion,
            "lrprodserv": data.lrprodserv,
            //"lrfecbuy": data.lrfecbuy,
            //"lrnroboleta": data.lrnroboleta,
            "lrmonrec": data.lrmonrec,
            "lrrecque": data.lrrecque,
            "lrdetalle": data.lrdetalle,
            "lrpedido": data.lrpedido,
            "lrpolpriv": data.lrpolpriv,

            "lrmenor": data.lrmenor || "",
            "lrapo_nombre": data.lrapo_nombre || "",
            "lrapo_domicilio": data.lrapo_domicilio || "",
            "lrapo_dni": data.lrapo_dni || "",
            "lrapo_telefono": data.lrapo_telefono || "",
            "lrapo_correo": data.lrapo_correo || "",

            "_wpcf7_unit_tag": "57bf5c1"
        };

        const form = new FormData();

        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(
            baseUrl + 'wp-json/contact-form-7/v1/contact-forms/778/feedback',
            form
        )
        .then((resp) => {

            console.log("RESPUESTA CF7:", resp.data);

            /*
            * AQUÍ colocaremos el campo real que
            * devuelve Serial Number for Contact Form 7.
            */
            const correlativo = resp.data.serial_number;

            const now = new Date();

            setNumeroReclamo(correlativo);
            setReclamoData({
                ...data,
                correlativo,
                fecha: now.toLocaleDateString('es-PE'),
                hora: now.toLocaleTimeString('es-PE'),
            });
            setLoadForm(false);
            handleOpen();

        })
        .catch((error) => {

            console.log("ERROR CF7:", error);

            setLoadForm(false);

        });
    };

    return (
        <LayoutPages classComp={'libroPageCont'}>
            <LayoutCont keyPage={'libroPage'}>
                <section className="secBox libroPage">
                    <Container>
                        
                        <BreadcrumbComp data={breadCrumb} />
                        
                        <div className="paperBox libroPageBox">
                            <div className="titleSections">
                                <h1>Libro de reclamos</h1>

                            </div>
                            <div className="inlineBlock lrNote">
                                <p>
                                    De acuerdo con lo establecido en el Código de Protección y Defensa del Consumidor, este
                                    establecimiento cuenta con un Libro de Reclamaciones para registrar exclusivamente tus quejas o reclamos. <br />
                                    Para sugerencias, opiniones, consultas u otros comentarios, puedes escribirnos
                                    al correo: administracion@asdimor.com.
                                </p>
                                <p>
                                    <strong>Razón Social</strong>: - Publicaciones Asdimor S.A.C <br />
                                    <strong>RUC</strong>: - 20517057933 <br />
                                    <strong>Dirección</strong>: Av. Chillon 236 Z.I Chacracerro, Comas, Lima.
                                </p>
                            </div>

                            <form  onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 5, }}
                                        className={errors.lrnombres ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrnombres" 
                                            name="lrnombres"
                                            label="Nombre y Apellidos o Razón Social:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrnombres")}
                                            error={errors.lrnombres ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4, }}
                                        className={errors.lrcorreo ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrcorreo" 
                                            name="lrcorreo"
                                            label="Email:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrcorreo")}
                                            error={errors.lrcorreo ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 3, }}
                                        className={errors.lrtelefono ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrtelefono" 
                                            name="lrtelefono"
                                            label="Teléfono Fijo o Celular:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrtelefono")}
                                            error={errors.lrtelefono ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4, }}
 
                                    >
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">Tipo de Documento</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                id="lrdoctype"
                                                name="lrdoctype"
                                                value={rdoDocType}
                                            >
                                                <FormControlLabel 
                                                    value="DNI" 
                                                    {...register("lrdoctype")}
                                                    onChange={rdoDocTypeChange}
                                                    control={<Radio />} 
                                                    label="DNI" 
                                                />
                                                <FormControlLabel 
                                                    value="Carnet de extrangeria" 
                                                    {...register("lrdoctype")}
                                                    onChange={rdoDocTypeChange}
                                                    control={<Radio />} 
                                                    label="Carnet de extrangeria"
                                                />
                                                <FormControlLabel 
                                                    value="Pasaporte" 
                                                    {...register("lrdoctype")}
                                                    onChange={rdoDocTypeChange}
                                                    control={<Radio />} 
                                                    label="Pasaporte" 
                                                />
                                            </RadioGroup>
                                        </FormControl>

 
                                    </Grid>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 8, }}
                                        className={errors.lrnumdoc ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrnumdoc" 
                                            name="lrnumdoc"
                                            label="Número de Documento:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrnumdoc")}
                                            error={errors.lrnumdoc ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4, }}
                                        className={errors.lrciudad ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <Autocomplete
                                            disablePortal
                                            variant='filled'
                                            id="lrciudad"
                                            name="lrciudad"
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
                                                    {...register("lrciudad")} 
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4, }}
                                        className={errors.lrprovincia ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <Autocomplete
                                            disablePortal
                                            id="lrprovincia"
                                            name="lrprovincia"
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
                                                {...register("lrprovincia")} 
                                            />
                                            )}
                                        />
                                    </Grid>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4, }}
                                        className={errors.lrdistrito ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <Autocomplete
                                            disablePortal
                                            id="lrdistrito"
                                            name="lrdistrito"
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
                                                    {...register("lrdistrito")} 
                                                    error={errors.lrdistrito ? true : false}
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                        className={errors.lrdireccion ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrdireccion" 
                                            name="lrdireccion"
                                            label="Dirección completa:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrdireccion")}
                                            error={errors.lrdireccion ? true : false}
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        size={{ xs: 12, sm: 12, md: 12 }}
                                    >
                                        <FormControl>
                                            <FormLabel>
                                                ¿Es menor de edad?
                                            </FormLabel>

                                            <RadioGroup
                                                row
                                                id="lrmenor"
                                                name="lrmenor"
                                                value={rdoMenorEdad}
                                                onChange={rdoMenorEdadChange}
                                            >
                                                <FormControlLabel
                                                    value="Si"
                                                    control={<Radio />}
                                                    label="Sí"
                                                    {...register("lrmenor")}
                                                />

                                                <FormControlLabel
                                                    value="No"
                                                    control={<Radio />}
                                                    label="No"
                                                    {...register("lrmenor")}
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {rdoMenorEdad === 'Si' && (
                                        <>
                                            <Grid
                                                item
                                                size={{ xs: 12, sm: 12, md: 6 }}
                                                className="textField textFieldWhite"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="lrapo_nombre"
                                                    name="lrapo_nombre"
                                                    label="Nombre y Apellidos del Apoderado:"
                                                    variant="filled"
                                                    onChange={changeField}
                                                    {...register("lrapo_nombre")}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                size={{ xs: 12, sm: 12, md: 6 }}
                                                className="textField textFieldWhite"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="lrapo_domicilio"
                                                    name="lrapo_domicilio"
                                                    label="Domicilio del Apoderado:"
                                                    variant="filled"
                                                    onChange={changeField}
                                                    {...register("lrapo_domicilio")}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                size={{ xs: 12, sm: 12, md: 4 }}
                                                className="textField textFieldWhite"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="lrapo_dni"
                                                    name="lrapo_dni"
                                                    label="DNI del Apoderado:"
                                                    variant="filled"
                                                    onChange={changeField}
                                                    {...register("lrapo_dni")}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                size={{ xs: 12, sm: 12, md: 4 }}
                                                className="textField textFieldWhite"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="lrapo_telefono"
                                                    name="lrapo_telefono"
                                                    label="Teléfono del Apoderado:"
                                                    variant="filled"
                                                    onChange={changeField}
                                                    {...register("lrapo_telefono")}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                size={{ xs: 12, sm: 12, md: 4 }}
                                                className="textField textFieldWhite"
                                            >
                                                <TextField
                                                    fullWidth
                                                    id="lrapo_correo"
                                                    name="lrapo_correo"
                                                    label="Correo del Apoderado:"
                                                    type="email"
                                                    variant="filled"
                                                    onChange={changeField}
                                                    {...register("lrapo_correo")}
                                                    error={errors.lrapo_correo ? true : false}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12 }}
 
                                    >
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">Identificación del activo contratado</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                id="lrprodserv"
                                                name="lrprodserv"
                                                value={rdoProdServ}
                                            >
                                                <FormControlLabel 
                                                    value="Producto" 
                                                    {...register("lrprodserv")}
                                                    onChange={rdoProdServChange}
                                                    control={<Radio />} 
                                                    label="Producto" 
                                                />
                                                <FormControlLabel 
                                                    value="Servicio" 
                                                    {...register("lrprodserv")}
                                                    onChange={rdoProdServChange}
                                                    control={<Radio />} 
                                                    label="Servicio" 
                                                />
                                            </RadioGroup>
                                        </FormControl>

                                    </Grid>


                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 4 }}
                                        className={errors.lrmonrec ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrmonrec" 
                                            name="lrmonrec"
                                            label="Monto Reclamado:" 
                                            variant="filled" 
                                            onChange={changeField}
                                            {...register("lrmonrec")}
                                            error={errors.lrmonrec ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12 }}
                                    >

                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label">Detalle del reclamo/queja</FormLabel>

                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                id="lrrecque"
                                                name="lrrecque"
                                                value={rdoRecQue}
                                            >
                                                <FormControlLabel 
                                                    value="Queja" 
                                                    {...register("lrrecque")}
                                                    onChange={rdoRecQueChange}
                                                    control={<Radio />} 
                                                    label="Queja" 
                                                />
                                                <FormControlLabel 
                                                    value="Reclamo" 
                                                    {...register("lrrecque")}
                                                    onChange={rdoRecQueChange}
                                                    control={<Radio />} 
                                                    label="Reclamo" 
                                                />
                                            </RadioGroup>
                                            <div className="lrSendNote">
                                                <p><strong>RECLAMO</strong>: Disconformidad relacionada a los productos o servicios</p>
                                                <p><strong>QUEJA</strong>:  Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público</p>
                                            </div>
                                        </FormControl>

                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                        className={errors.lrdetalle ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrdetalle" 
                                            name="lrdetalle"
                                            label="Detalle:" 
                                            variant="filled" 
                                            multiline
                                            rows={3}
                                            onChange={changeField}
                                            {...register("lrdetalle")}
                                            error={errors.lrdetalle ? true : false}
                                        />
                                    </Grid>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                        className={errors.lrpedido ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } 
                                    >
                                        <TextField 
                                            fullWidth 
                                            id="lrpedido" 
                                            name="lrpedido"
                                            label="Pedido:" 
                                            variant="filled" 
                                            multiline
                                            rows={3}
                                            onChange={changeField}
                                            {...register("lrpedido")}
                                            error={errors.lrpedido ? true : false}
                                        />
                                    </Grid>

                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                    >
                                        <div className="lrSendNote">
                                            <p>
                                                <strong>PUBLICACIONES ASDIMOR S.A.C.</strong> declara que el tratamiento de sus datos personales en este portal tiene por
                                                finalidad gestionar de manera correcta su reclamo o queja conforme las disposiciones legales sobre
                                                la materia y llevar un registro histórico a fin de mejorar nuestros niveles de atención
                                            </p>
                                            <p>
                                                La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito 
                                                previo para interponer una denuncia ante el <strong>INDECOPI</strong>
                                            </p>
                                            <p>
                                                El proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles
                                            </p>
                                        </div>
                                        <div className="textFielCheck">
                                            {errors.lrpolpriv && <Alert className={'lrErrorMsg'} severity="error" >This is an error Alert.</Alert>}
                                            <FormGroup>
                                                <FormControlLabel 
                                                    
                                                    label={<strong>He leído y autorizo el tratamiento de mis datos según la Política de Privacidad de Publicaciones Asdimor SAC</strong>} 
                                                    control={
                                                        <Checkbox 
                                                            name={'lrpolpriv'}
                                                            value={fieldBody.lrpolpriv} 
                                                            {...register("lrpolpriv")}
                                                            onChange={changeField}
                                                        />
                                                    }
                                                />
                                            </FormGroup>
                                        </div>


                                    </Grid>
                                    <Grid 
                                        item 
                                        size={{ xs: 12, sm: 12, md: 12, }}
                                    >
                                        {loadForm === false  ? 
                                            <button className="btnPrimary">
                                                Enviar reclamo
                                            </button>
                                        :
                                            <button className="btnPrimary">
                                                <CircularProgress size={"30px"} />
                                            </button>
                                        }
                                    </Grid>
                                </Grid>
                            </form>
                        </div>

                    </Container>
                </section>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="lrModalCont">
                        <div className={'lrModalClose'} onClick={handleClose}>
                            <CloseIcon />
                        </div>
                        <figure>
                            <img src={icoReclamo} alt="" />
                        </figure>

                        <div className="txt">

                            <h3>
                                Gracias por enviar tu reclamo
                            </h3>

                            <h4>
                                Tu reclamo N° <strong>{numeroReclamo}</strong> ha sido
                                enviado con copia a tu Correo electrónico.
                            </h4>

                            <a
                                href="#"
                                className="btnPrimary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleGenerarPDF();
                                }}
                            >
                                Descargar PDF
                            </a>

                        </div>

                    </div>
                </Modal>
            </LayoutCont>
        </LayoutPages>
    )
};

export default LibroDeReclamosPage;
