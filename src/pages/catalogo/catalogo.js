import {useEffect,useState} from "react";
import './catalogo.scss'
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import Container from '@mui/material/Container';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';

import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';

import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";



const CatalogoPage = (props) => {
    
    const breadCrumb = [{name:'Inicio',link:'/'},{name:'Catálogo'}];
    const {baseUrl} = useAuthContext();
    const [infoPage,setInfoPage] = useState();
    const [infoPage2,setInfoPage2] = useState();
    const [fieldBody,setFieldBody] = useState({});

    const [open, setOpen] = useState(false);
    const [catSelected,setCatSelected] = useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [catList,setCatList] = useState();
    const getCategorias = () =>{
        axios.get(baseUrl+'wp-json/wp/v2/categorias_catalogos')
            .then((resp)=>{

                const listCatTmp = [{
                    id:'todos',
                    name:'Todos',
                    click:true
                }];

                resp.data.map((item)=>{
                    listCatTmp.push({
                        id:item.id,
                        name:item.name,
                        click:false
                    })
                })
                setCatList(listCatTmp);
            }).catch((error)=>{
                console.log(error)
            })
    }

    const changeCategory = (id) =>{
        const catListTmp = [];
        catList.map((item)=>{
            if(item.id === id){
                catListTmp.push({
                    id:item.id,
                    name:item.name,
                    click:true
                })
            }else{
                catListTmp.push({
                    id:item.id,
                    name:item.name,
                    click:false
                })
            }
        })
        setCatList(catListTmp);

        const prodListTmp = [];
        infoPage2.map((item)=>{
            if(id === 'todos'){
                prodListTmp.push(item);
            }else{
                if(item.categorias_catalogos && item.categorias_catalogos.length > 0){
                    if(item.categorias_catalogos[0] === id){
                        prodListTmp.push(item);
                    }
                }
            }
        })
        setInfoPage(prodListTmp);
    }

    const getCatalogos = ()=>{
        axios.get(baseUrl+'wp-json/wp/v2/catalogos/')
        .then((resp)=>{
            setInfoPage(resp.data);
            setInfoPage2(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        getCategorias();
        getCatalogos();
    },[]);


    const validationSchema = Yup.object().shape({
        catnombres: Yup.string().required("Ingrese su nombre por favor.").min(2).max(45),
        catcorreos:Yup.string().email().required()
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
        setFieldBody({
            ...fieldBody,
            [e.target.name]: e.target.value
        })
    }

    const [loadForm,setLoadForm] = useState(false);
    const onSubmit = (data) => {
        setLoadForm(true);
    
        //[contact-form-7 id="b6da435" title="Catalogo"]

        const emailBody = {
            "nombres": data.catnombres,
            "correo": data.catcorreos,
            "telefono": data.cattelefono,
            //"categoria": 
            "_wpcf7_unit_tag": "b6da435"
        };

    
        const form = new FormData();
        for (const field in emailBody) {
            form.append(field, emailBody[field]);
        }

        axios.post(baseUrl+ 'wp-json/contact-form-7/v1/contact-forms/1010/feedback',form).then((resp)=>{
            setLoadForm(false);
            window.open(catSelected, '_blank');
            handleClose();
        }).catch((error)=>{
            console.log(error)
        })
    }

    return (
        <LayoutPages classComp={'catalogoPageCont'}>
            <LayoutCont keyPage={'CatalogoPage'}>
                <section className="secBox catalogoPageSec">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />
                        <div className="titleSections">
                            <h1>Catálogo</h1>
                        </div>
                        
                        <div className="inlineFlex catapBox">
                            {catList && catList.length && catList.length > 0 &&
                                <ul className="catapCatList">
                                    {catList.map((item)=>{
                                        return (
                                            <li 
                                                className={item.click ? 'active':''}
                                                onClick={()=>changeCategory(item.id)}
                                            >
                                                {item.name}
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                            {infoPage && infoPage.length &&
                                <ul className="catapBoxList">
                                    {infoPage.map((item)=>(
                                        <li>
                                            <div className="catapItem">
                                                <h3>{item.title.rendered}</h3>
                                                <figure>
                                                    <img src={item.acf.post_catalogo_img} alt="" />
                                                    {item.categorias_catalogos[0] === 59?
                                                        <a 
                                                            className="catapDownload" 
                                                            onClick={()=>{
                                                                handleOpen();
                                                                setCatSelected(item.acf.post_catalogo_archivo)
                                                            }}
                                                            target="_blank"
                                                        >
                                                            <CloudDownloadOutlinedIcon />
                                                        </a>
                                                    :
                                                    
                                                        <a 
                                                            className="catapDownload" 
                                                            target="_blank" 
                                                            href={item.acf.post_catalogo_archivo} download>
                                                            <CloudDownloadOutlinedIcon />
                                                        </a>
                                                    }
                                                </figure>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                        
                    </Container>
                </section>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className={loadForm ? 'catapModalBox catapModalBoxAct' : 'catapModalBox'}>
                        <div className="catapModalClose" onClick={handleClose}>
                            <CloseIcon />
                        </div>
                        <div className="titleSections">
                            <h3>Descargar catálogo:</h3>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="inlineFlex textField">
                                <TextField 
                                    fullWidth 
                                    id="catnombres" 
                                    name="catnombres"
                                    label="Nombres completos:" 
                                    variant="filled" 
                                    onChange={changeField}
                                    {...register("catnombres")}
                                    error={errors.catnombres ? true : false}
                                />
                            </div>
                            <div className="inlineFlex textField">
                                <TextField
                                    fullWidth 
                                    id="catcorreos" 
                                    name="catcorreos"
                                    label="Correo:" 
                                    variant="filled"
                                    onChange={changeField}
                                    {...register("catcorreos")}
                                    error={errors.catcorreos ? true : false}
                                />
                            </div>
                            <div className="inlineFlex textField">
                                <TextField 
                                    fullWidth
                                    id="cattelefono" 
                                    name="cattelefono"
                                    label="Teléfono:"
                                    variant="filled"
                                    onChange={changeField}
                                    {...register("cattelefono")}
                                    error={errors.cattelefono ? true : false}
                                />
                            </div>
                            <button type={'submit'} className={'btnPrimary'}>
                                Enviar
                            </button>
                        </form>
                    </div>
                </Modal>
            </LayoutCont>
        </LayoutPages>
            
    )
};

export default CatalogoPage;
