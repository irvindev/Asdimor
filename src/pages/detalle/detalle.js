import { useEffect, useState } from "react"
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';

import './detalle.scss'

import Container from '@mui/material/Container';

import icoStart from '../../assets/img/ico_start.svg';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';
import SwiperProducts from './../../components/home/SwiperProducts/SwiperProducts';

import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import icoDetalle1 from '../../assets/img/ico_detalle1.png';
import icoDetalle2 from '../../assets/img/ico_detalle2.png';
import icoDetalle3 from '../../assets/img/ico_detalle3.png';
import icoDetalle4 from '../../assets/img/ico_detalle4.png';
import icoDetalle5 from '../../assets/img/ico_detalle5.png';
import icoDetalle6 from '../../assets/img/ico_detalle6.png';
import DetailSharedSocial from './../../components/details/Social/Social';
import { useParams } from "react-router";
import Skeleton from '@mui/material/Skeleton';

import Modal from '@mui/material/Modal';

import axios from 'axios';
import DetailGallery from './../../components/details/SwiperGallery/SwiperGallery';
import BlockAnimate from './../../components/util/BlockAnim/BlockAnim';
import { useAuthContext } from './../../context/authContext';

import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import DetailVolantes from './../../components/details/SwiperVolantes/SwiperVolantes';
import DetailPortadas from './../../components/details/SwiperPortadas/SwiperPortadas';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



import Sticky from 'react-sticky-el';
import { Link,useLocation } from 'react-router';
import ProductSEO from './../../components/productSeo/productSeo';


const DetallePage = (props) => {

    let params = useParams();
    const { token, keysWc, allProducts,addItemToCart, setCartMenuOpen, baseUrl } = useAuthContext();
    const { pathname } = useLocation();

    const [breadCrumb,setBreadCrumb] = useState([
            {
                name:'Inicio',
                link:'/'
            },
            {
                name:'Tienda',
                link:'/tienda'
            },
            {
                name:'--'
            },
    ]);

    const [portadaImg,setPortadaImg] = useState();
    const [mPortadaImg,setMPortadaImg] = useState();
    
    const changePortada = (img, num) => {
        const imagesTmp = info.images.map((imgItem, index) =>
            index === 0 ? { ...imgItem, src: img } : { ...imgItem }
        );

        setPortadaImg(img);
        setMPortadaImg(num);
        setInfo({ ...info, images: imagesTmp });
    };
    const [pagesCant,setPagesCant] = useState();
    const changePagesCant = (itemIndx,pricePag) =>{
        setPagesCant(itemIndx)
        setInfo({...info,price:parseFloat(pricePag).toFixed(2)})
    }

    const [openPortadas, setOpenPortadas] = useState(false);
    const handleOpenPortadas = () => setOpenPortadas(true);
    const handleClosePortadas = () => setOpenPortadas(false);

    const [info,setInfo] = useState();
    const [prodList,setProdList] = useState([]);
    
    const [relatedList,setRelatedList] = useState([]);
    const [setDetail,setSeoDetail] = useState();

    const getDetails = async () =>{
        if(allProducts){
            
            const detailProduct = await allProducts.filter((item)=>item.slug === params.slug );
            setSeoDetail(detailProduct[0]);

            await axios.get(baseUrl+'wp-json/wc/v2/products/'+detailProduct[0].id+'?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs)
            .then((resp)=>{
                console.log('aaaaaa==>',resp.data.acf)
                setInfo(resp.data)
                if(resp.data.acf.prodacf_aditional){
                    resp.data.acf.prodacf_aditional.map((item)=>{
                        //setPagesCant(item.prodacf_aditional_descripcion)
                        if(item.prod_acf_portadas_verify.length > 0){
                            //console.log('det pag',item.prodacf_aditional_descripcion)
                            setPagesCant(item.prodacf_aditional_descripcion)
                        }
                    })
                    
                }

                const prodTmpList = [];
                if(allProducts && allProducts.length){
                    const relatedLisTmp = [];
                    allProducts.map((item)=>{
                        if(resp.data.categories[0].id === item.category_ids[0]){
                            relatedLisTmp.push(item)
                            setRelatedList(relatedLisTmp)
                        }
                        
                        if(resp.data.acf.prodacf_ifprom_rell && resp.data.acf.prodacf_ifprom_rell.length && resp.data.acf.prodacf_ifprom_rell){
                            resp.data.acf.prodacf_ifprom_rell.map((sItem,sIndex)=>{
                                if(sItem === item.id){
                                    prodTmpList.push(item)
                                }
                            })
                        }
                    })
                }
                setProdList(prodTmpList)    

                setBreadCrumb([
                    {name:'Inicio',link:'/'},
                    {name:'Tienda',link:'/tienda'},
                    {name:resp.data.name}
                ]);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }).catch((errr)=>{
                console.log(errr)
            })
        }
    }
    
    const [sinop,setSinop] = useState(false);

    const sinopsisExpand = ()=>{
        setSinop(!sinop)
    }

    // Cantidad product
    const [cantidadProd,setCantidadProd] = useState(1);
    const changeCantProdPlus = ()=>{
        setCantidadProd(cantidadProd+1)
        setInfo({...info,amount:cantidadProd+1})
    }

    const changeCantProdMinus = ()=>{
        if(cantidadProd < 2){
            setCantidadProd(1)
            setInfo({...info,amount:1})
        }else{
            setCantidadProd(cantidadProd-1)
            setInfo({...info,amount:cantidadProd-1})
        }
    }

    const changePort = (imgPort) =>{
        const imagesTmp = info.images;
        imagesTmp[0].src = imgPort.prodacf_ifportadas_limg;

        setInfo({...info,images:imagesTmp})
    }

    const changeVol = (imgVol) =>{
        const imagesTmp = info.images;
        imagesTmp[0].src = imgVol.prodacf_vol_img;
        setInfo({...info,images:imagesTmp})
    }

    
    const addProductToCart = () =>{
        if(info.acf.prodacf_aditional){
            
            if(pagesCant !== -1){
                const infoTmp = {...info,aditionals:
                    {
                        pages:pagesCant,
                        price:1,
                        portada: portadaImg
                    }
                };
                addItemToCart(infoTmp);
                setCartMenuOpen(true);
            }
        }else{
            addItemToCart(info);
            setCartMenuOpen(true);
        }
    }


    useEffect(()=>{
        getDetails();
    },[allProducts,params,pathname]);



    return (
        
        <LayoutPages classComp={'detallePageCont'}>

            <ProductSEO seo={setDetail && setDetail.seo}  />

            <LayoutCont keyPage={'DetallePage'}>
                <section className="secBox detallePageBox" >
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />

                        <div className="inlineFlex detallePage">
                            <Sticky 
                                boundaryElement=".detallePage" 
                                topOffset={-170} 
                                hideOnBoundaryHit={false} 
                                className={'inlineFlex detallePageGaleria'}  
                                stickyClassName={'detallePageGaleriaAct'}
                            >
                                <BlockAnimate
                                    claseStyle={'inlineFlex '}
                                    stateParam={info}
                                    unicId={'detallePageGaleria'}
                                >
                                    {info && info.images.length ?
                                        <DetailGallery data={info.images} />
                                    :
                                        <div className="inlineFlex detallePageGaleriaBox">
                                            <div className="list">
                                                <div className="item itemResp">
                                                    <Skeleton variant="rounded" animation="wave" width={'100%'} height={170} />
                                                </div>
                                                <div className="item itemResp">
                                                    <Skeleton variant="rounded" animation="wave" width={'100%'} height={170} />
                                                </div>
                                                <div className="item itemResp">
                                                    <Skeleton variant="rounded" animation="wave" width={'100%'} height={170} />
                                                </div>
                                            </div>
                                            <figure>
                                                <Skeleton variant="rounded" animation="wave" width={'100%'} height={600} />
                                            </figure>
                                        </div>
                                    }
                                </BlockAnimate>
                            </Sticky>

                            <div className="inlineFlex detallePageInfo">
                                <BlockAnimate
                                    claseStyle={'title'}
                                    stateParam={info}
                                    unicId={'titleDetPage'}
                                >
                                    {info ?
                                        <h1>{info.name}</h1>
                                    :
                                        <Skeleton variant="text" animation="wave" sx={{ fontSize: '3rem',width:'100%' }} />
                                    }
                                </BlockAnimate>

                                <BlockAnimate
                                    claseStyle={'inlineFlex startListBox'}
                                    stateParam={info}
                                    unicId={'startList'}
                                >
                                    {info ?
                                        <div className='inlineFlex startList'>
                                            <img src={icoStart} alt="" />
                                            <img src={icoStart} alt="" />
                                            <img src={icoStart} alt="" />
                                            <img src={icoStart} alt="" />
                                            <img src={icoStart} alt="" />
                                        </div>
                                    :
                                        <Skeleton variant="text" animation="wave" sx={{ fontSize: '2.5rem',width:'50%' }} />
                                    }
                                </BlockAnimate>
                                

                                <BlockAnimate
                                    claseStyle={'inlineFlex detallePriceBox'}
                                    stateParam={info}
                                    unicId={'detallePrice'}
                                >
                                    {info ?                                    
                                        <div className="inlineFlex detallePrice">
                                            <div className="inlineFlex dpricItem price">
                                                <h5>Precio:</h5>
                                                <p>Codigo: <strong>{info.sku ?info.sku :'--'}</strong></p>
                                                <h2>S/ {info.price}</h2>
                                            </div>
                                            <div className="inlineFlex dpricItem quantity">
                                                <h5>Cantidad:</h5>

                                                <p>Stock: <strong>{info.stock_quantity ? info.stock_quantity:'--'}</strong></p>
                                                <div className="inlineFlex pdQuantity">
                                                    <div className="minus" onClick={changeCantProdMinus}>
                                                        <RemoveIcon />
                                                    </div>
                                                    <span>{cantidadProd}</span>
                                                    <div className="plus" onClick={ changeCantProdPlus}>
                                                        <AddIcon />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="inlineFlex dpricItem btnBox">
                                                <div href="#" className="btn" onClick={()=>{addProductToCart()}}>
                                                    < AddIcon/> Agregar
                                                </div>
                                                <div href="#" className="btn" onClick={()=>{addProductToCart()}}>
                                                    <ArrowForwardIcon/> Ir a pagar - S/ { info.price * cantidadProd }
                                                </div>
                                                {info && info.acf && info.acf.prodacf_ifprom_switch && info.acf.prodacf_ifprom_switch.length && info.acf.prodacf_ifprom_switch.length > 0 ?
                                                    <Link 
                                                        to={ prodList && prodList.length ? '/tienda/'+ prodList[0].slug : '/tienda' }
                                                        className="btnProm"
                                                    >
                                                        <LocalOfferIcon /> Ver promoción
                                                    </Link>
                                                    :
                                                    <></>
                                                }
                                            </div>
                                        </div>
                                    :
                                        <div className="inlineFlex detallePrice">
                                            <Skeleton variant="rounded" animation="wave" width={'100%'} height={90} />
                                        </div>
                                    }
                                </BlockAnimate>

                                {info && info.acf && info.acf.prodacf_aditional  &&
                                    <div className="inlineFlex detalleSinopsisBox detalleTecnicoBox">
                                        <div className="inlineFlex detalleSinopsis detalleTecnico">
                                            <h3>Seleccione hojas/portada:</h3>

                                            <div className="inlineFlex detallePortadaList">

                                                <div className="detallePortadaItem">
                                                    {info.acf.prodacf_aditional && info.acf.prodacf_aditional.length > 0 &&
                                                        <ul>
                                                            {info.acf.prodacf_aditional.map((item)=>
                                                                    <li 
                                                                        className={pagesCant === item.prodacf_aditional_descripcion ? 'active ' : '' } 
                                                                        onClick={()=>changePagesCant(item.prodacf_aditional_descripcion,item.prod_acf_portadas_valor)}
                                                                    >
                                                                        <CollectionsBookmarkOutlinedIcon />
                                                                        <p>{item.prodacf_aditional_descripcion}</p>
                                                                    </li>
                                                                )}
                                                        </ul>
                                                     }

                                                </div>
                                                <div className="detallePortadaItem">
                                                     <div className="detallePortadaSelect">
                                                        <figure>
                                                            {portadaImg &&
                                                                <img src={portadaImg} alt="" />
                                                            }
                                                        </figure>
                                                        <div className="inlineFlex btn" onClick={handleOpenPortadas}>
                                                            {portadaImg ? 'Cambiar portada' : 'Seleccionar portada'} <ArrowForwardIosOutlinedIcon />
                                                        </div>
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {info && info.acf && info.acf.prodacf_vol  &&
                                    <div className="inlineFlex detalleSinopsisBox detalleTecnicoBox">
                                        <div className="inlineFlex detalleSinopsis detalleTecnico">
                                            <h3>Seleccione portada:</h3>

                                            <div className="inlineFlex detalleVolantes">

                                                <DetailVolantes data={info.acf.prodacf_vol} changeVol={changeVol} />
                                            </div>
                                        </div>
                                    </div>
                                }

                                
                                {info && info.acf && info.acf.prodacf_ifportadas_list  &&
                                    <div className="inlineFlex detalleSinopsisBox detalleTecnicoBox">
                                        <div className="inlineFlex detalleSinopsis detalleTecnico">
                                            <h3>Seleccione portada:</h3>

                                            <div className="inlineFlex detalleVolantes">

                                                <DetailPortadas data={info.acf.prodacf_ifportadas_list} changePort={changePort} />
                                            </div>
                                        </div>
                                    </div>
                                }

                                <BlockAnimate
                                    claseStyle={'inlineFlex detalleSinopsisBox detalleTecnicoBox'}
                                    stateParam={info}
                                    unicId={'detalleSinopsis'}
                                >
                                    <DetailSharedSocial data={info && info.slug && info.slug}  title={info && info.name && info.name} />
                                </BlockAnimate>

                                <BlockAnimate
                                    claseStyle={'inlineFlex detalleSinopsisBox'}
                                    stateParam={info}
                                    unicId={'detalleSinopsis'}
                                >
                                    {info &&  info.acf && info.acf.prodacf_sinopsis !== "" ? 
                                        <div className="inlineFlex detalleSinopsis">
                                            <h3>Sinopsis</h3>
                                            <div
                                                dangerouslySetInnerHTML={{__html: info.acf.prodacf_sinopsis}}
                                                className={sinop ? 'detalleSinopsisP detalleSinopsisPact ' : 'detalleSinopsisP'}
                                            ></div>

                                            <div className="inlineFlex btnExpand" onClick={sinopsisExpand}>Expandir <KeyboardArrowDownIcon/></div>
                                        </div>
                                    :
                                        <Skeleton variant="rounded" animation="wave" className={'detalleSinopsisLoad'} width={'100%'} height={90} />
                                    }
                                </BlockAnimate>


                                <BlockAnimate
                                    claseStyle={'inlineFlex detalleSinopsisBox detalleTecnicoBox'}
                                    stateParam={info}
                                    unicId={'detalleSinopsis'}
                                >
                                    {info ?
                                        <div className="inlineFlex detalleSinopsis detalleTecnico">
                                            <h3>Características:</h3>
                                            <ul className='inlineFlex detalleSinopsisList'>
                                                {info.acf && info.acf.prodacf_dt_npag !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle1} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>N° Paginas</small>
                                                            <strong>{info.acf.prodacf_dt_npag}</strong>
                                                        </div>
                                                    </li>
                                                }
                                                {info.acf && info.acf.prodacf_dt_ano !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle2} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>Año:</small>
                                                            <strong>{info.acf.prodacf_dt_ano}</strong>
                                                        </div>
                                                    </li>
                                                }
                                                {info.acf && info.acf.prodacf_dt_enc !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle3} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>Encuadernacion</small>
                                                            <strong>{info.acf.prodacf_dt_enc}</strong>
                                                        </div>
                                                    </li>
                                                }
                                                {info.acf && info.acf.prodacf_dt_tamano !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle4} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>Tamaño:</small>
                                                            <strong>{info.acf.prodacf_dt_tamano}</strong>
                                                        </div>
                                                    </li>
                                                }
                                                {info.acf && info.acf.prodacf_dt_peso !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle5} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>Peso</small>
                                                            <strong>{info.acf.prodacf_dt_peso}</strong>
                                                        </div>
                                                    </li>
                                                }
                                                {info.acf && info.acf.prodacf_dt_peso !== '' &&
                                                    <li>
                                                        <figure>
                                                            <img src={icoDetalle6} alt="" />
                                                        </figure>
                                                        <div className="txt">
                                                            <small>ISBN</small>
                                                            <strong>{info.acf.prodacf_dt_isbn}</strong>
                                                        </div>
                                                    </li>
                                                }
                                            </ul>
                                        </div>
                                    :
                                        <Skeleton variant="rounded" animation="wave" className={'detalleSinopsisLoad'} width={'100%'} height={90} />   
                                    }
                                </BlockAnimate>
                                
                            </div>
                        </div>
                    </Container>
                </section>
                {relatedList && relatedList.length > 0 &&
                    <section className="secBox detalleRecomend">
                        <Container>
                            <div className="titleSections">
                                <h3>También tenemos:</h3>
                            </div>
                            <SwiperProducts data={relatedList.length >= 3 ? relatedList : allProducts} />
                        </Container>
                    </section>
                }

                <Modal
                    open={openPortadas}
                    onClose={handleClosePortadas}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="modalPortadas">
                        <h1>Escoja su portada por favor:</h1>
                        <p>*Modelos sujetos a disponibilidad de stock.</p>
                        {info && info.acf && info.acf.prodacf_portadas && info.acf.prodacf_portadas.length && info.acf.prodacf_portadas.length > 0 &&
                        <ul>
                            {info.acf.prodacf_portadas.map((item,index)=>(
                                <li className={mPortadaImg === index ? 'active':''}>
                                    <figure onClick={()=>changePortada(item,index)}>
                                        <div className="inlineFlex iconCheck">
                                            <CheckIcon />
                                        </div>
                                        <img src={item} alt="" />
                                    </figure>
                                </li>
                            ))}
                        </ul>
                        }
                        <div className="inlineFlex mopoBtnBox">
                            <div className="btnPrimary" onClick={handleClosePortadas}>
                                Confirmar
                            </div>
                        </div>
                    </div>
                </Modal>
            </LayoutCont>
        </LayoutPages>
        
    )
};

export default DetallePage;
