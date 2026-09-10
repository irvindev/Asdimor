import {useEffect,useState} from "react";
import './descargas.scss';

import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import Container from '@mui/material/Container';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';

import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';


const DescargasPage = (props) => {

    const breadCrumb = [{name:'Inicio',link:'/'},{name:'Catálogo'}]
    const {baseUrl} = useAuthContext();
    const [infoPage,setInfoPage] = useState();
    const [infoPage2,setInfoPage2] = useState();

    const getDescargas = ()=>{
        axios.get(baseUrl+'wp-json/wp/v2/descargas?per_page=100')
        .then((resp)=>{

            setInfoPage(resp.data);
            setInfoPage2(resp.data);
        }).catch((error)=>{
            console.log(error)
        })
    }

    const [catList,setCatList] = useState();
    const getCategorias = () =>{
        axios.get(baseUrl+'wp-json/wp/v2/categorias_descargas')
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
                if(item.categorias_descargas && item.categorias_descargas.length > 0){
                    if(item.categorias_descargas[0] === id){
                        prodListTmp.push(item);
                    }
                }
            }
        })
        setInfoPage(prodListTmp);
    }

    useEffect(()=>{
        getCategorias();
        getDescargas();
    },[])

    return (
        <LayoutPages classComp={'descargasPageCont'}>
            <LayoutCont keyPage={'DescargasPage'}>
                <section className="secBox descargasPageSec">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />
                        <div className="titleSections">
                            <h1>Descargas</h1>
                        </div>
                        <div className="inlineFlex descpBox">
                            {catList && catList.length && catList.length > 0 &&
                                <ul className="descpCatList">
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
                                <ul className="descpBoxList">
                                    {infoPage.map((item)=>(
                                        <li>
                                            <div className="descpItem">
                                                <h3>{item.title.rendered}</h3>

                                                <figure>
                                                    <img src={item.acf.post_descargas_img} alt="" />
                                                    <a className="descpDownload"  target="_blank" href={item.acf.post_descargas_archivo} download>
                                                        <CloudDownloadOutlinedIcon />
                                                    </a>
                                                </figure>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </Container>
                </section>
            </LayoutCont>
        </LayoutPages>
    )
};

export default DescargasPage;
