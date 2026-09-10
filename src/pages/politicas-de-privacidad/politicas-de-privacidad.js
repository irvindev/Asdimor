import React,{useState,useEffect} from "react";
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';

import Container from '@mui/material/Container';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';

import axios from 'axios';

import './politicas-de-privacidad.scss';
import { useAuthContext } from './../../context/authContext';

const PoliticasDePrivacidadPage = (props) => {

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
        axios.get(baseUrl+'wp-json/wp/v2/pages/780')
            .then((resp)=>{
                setInfo(resp.data);
            }).catch((err)=>{
                console.log(err);
            })
    }

    useEffect(()=>{
        getInfo();
    },[])
    
    return (
        <LayoutPages classComp={'politicasPageCont'}>
            <LayoutCont keyPage={'politicasPage'}>
                <section className="secBox politicasPage">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />
                        
                        <div className="paperBox politicasPageBox">
                            <div className="titleSections">
                                <h1>Políticas de privacidad</h1>

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

export default PoliticasDePrivacidadPage;
