import React,{useState,useEffect} from "react";
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';

import Container from '@mui/material/Container';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';

import axios from 'axios';

import './terminos-y-condiciones.scss';
import { useAuthContext } from './../../context/authContext';

const TerminosCondicionesPage = (props) => {

    const [breadCrumb,setBreadCrumb] = useState([
            {
                name:'Inicio',
                link:'/'
            },
            {
                name:'Políticas de privacidad',
            }
    ]);

    const { baseUrl} = useAuthContext();

    const [info,setInfo] = useState();

    const getInfo= ()=>{
        axios.get(baseUrl+'wp-json/wp/v2/pages/779')
            .then((resp)=>{
                setInfo(resp.data);
            }).catch((err)=>{
                console.log(err);
            })
    }

    useEffect(()=>{
        getInfo();
    },[]);

    return (
        <LayoutPages classComp={'termPageCont'}>
            <LayoutCont keyPage={'termPage'}>
                <section className="secBox libroPage">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />
                        
                        <div className="paperBox termPageBox">
                            <div className="titleSections">
                                <h1 onClick={()=>console.log(info)}>{info && info.title && info.title.rendered && info.title.rendered}</h1>

                            </div>
                            {info && info.content &&
                            <div className="campTxt" dangerouslySetInnerHTML={{__html: info.content.rendered}}>

                            </div>
                            }
                        </div>
                    </Container>
                </section>
            </LayoutCont>
        </LayoutPages>
    )
};

export default TerminosCondicionesPage;