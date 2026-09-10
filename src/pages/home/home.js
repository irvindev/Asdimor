import './home.scss';

import LayoutCont from '../../components/LayoutCont/LayoutCont';
import LayoutPages from '../../components/LayoutPages/LayoutPages';
import Container from '@mui/material/Container';
import HomeSwiperIntro from '../../components/home/SwiperIntro/SwiperIntro';
import HomeAnimIntro from '../../components/home/hojaAnim/hojaAnim';
import SwiperProducts from '../../components/home/SwiperProducts/SwiperProducts';
import { useEffect, useState, useCallback } from 'react';

import axios from 'axios';
import { useAuthContext } from './../../context/authContext';
import SwiperPub from './../../components/home/SwiperPub/SwiperPub';

import SwiperHomeCategories from './../../components/home/SwiperCategories/SwiperCategories';
import { Link } from 'react-router';

import Modal from '@mui/material/Modal';
import HomeNewslatter from './../../components/home/Newslatter/Newslatter';
import ProductSEO from './../../components/productSeo/productSeo';
import SwiperProductsLoad from './../../components/home/SwiperProducts/SwiperProductsLoad';

const HomePage = (props) => {

  const { homeInfo, infoGeneral, allProducts, productCategories } = useAuthContext();

  const [catList, setCatList] = useState([]);
  const [infoHome, setInfoHome] = useState();
  const [infoConf, setInfoCont] = useState();
  const [catListProducts, setCatListProducts] = useState([]);
  

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getProdCat = () => {
    setCatList(productCategories);
  };

  useEffect(() => {
    getProdCat();
  }, [productCategories]);

  useEffect(() => {
        // Actualizamos de forma reactiva a medida que la data vaya estando disponible
      if (homeInfo) setInfoHome(homeInfo);
      if (infoGeneral) setInfoCont(infoGeneral);

      if (!homeInfo || !allProducts) return;

      const secciones = homeInfo.pageHome?.introSecciones || [];
      const resultCategories = [];

      secciones.forEach((item) => {
          if (
              item.__typename === 'PageHomeIntroSeccionesHsecCategoriaLayout' &&
              item.hsecCategoriaCat.nodes?.length
          ) {
              const ids = item.hsecCategoriaCat?.nodes?.map((cat) => cat.databaseId);
              const nameTx = item.hsecCategoriaCat?.nodes[0]?.slug;

              const exists = resultCategories.some((cat) => cat.name === nameTx);
              if (!exists && nameTx) {
                  const filteredList = allProducts
                      .filter((product) =>
                          product?.category_ids.some((prodCatId) =>
                              ids.map(Number).includes(Number(prodCatId))
                          )
              )
              .slice(0, 10);

            resultCategories.push({
                name: nameTx,
                list: filteredList,
            });
          }
        }
      });

      
      setCatListProducts(resultCategories);
    }, [homeInfo, allProducts, infoGeneral]);
  return (
    
      <LayoutPages classComp={'homePage'}>
        <ProductSEO seo={homeInfo && homeInfo.seo} />
        <LayoutCont keyPage={'HomePage'}>

          {infoHome && infoHome.pageHome && infoHome.pageHome?.introSecciones && infoHome.pageHome?.introSecciones.length && infoHome.pageHome?.introSecciones.length > 0 && infoHome.pageHome?.introSecciones.map((item)=>{

            if(item.__typename === 'PageHomeIntroSeccionesHsecIntroLayout'){
              return (
                <section className="secBox homeIntro">
                  <HomeAnimIntro />
                  <Container>
                    <div className="inlineFlex homeIntroBox">
                      <div className="inlineFlex titleBox">
                        <div dangerouslySetInnerHTML={{__html: item.hsecIntroTxt}}></div>
                        <div className="btnBox">
                          <Link className={'btnPrimary'} to={'/tienda'}>
                            Ver más
                          </Link>
                        </div>
                      </div>
                      {item.hsecIntroSwitch && item.hsecIntroSwitch.length > 0 ?
                        <div 
                          className="homeIntroCarrusel"
                        >
                          { item.hsecIntroImglink === '' ?
                            <img src={item.hsecIntroImg?.node?.sourceUrl} alt="" />
                          :
                            <Link to={item.hsecIntroImglink}>
                              <img src={item.hsecIntroImg?.node?.sourceUrl} alt="" />
                            </Link>
                          }
                        </div>

                      :
                        <div className="homeIntroCarrusel">
                          {item.hsecIntroProductos?.nodes ?
                            <HomeSwiperIntro data={item.hsecIntroProductos?.nodes}/>
                          :
                            <p>Agregar productos</p>
                          }
                        </div>
                      }
                    </div>
                  </Container>
                </section>
              )
            }else if(item.__typename === 'PageHomeIntroSeccionesHsecCategoriaLayout'){
              return (
                <section className="secBox homeMasvendido">
                  <Container>
                      <div className="inlineBlock homeMasvendidoBox">
                        <div onClick={()=>{console.log(catListProducts)}} className="titleSections">
                          <h2>{item.hsecCategoriaTitulo ? item.hsecCategoriaTitulo : '--'}</h2>
                        </div>
                        {catListProducts && catListProducts.length > 0 ? (
                          (() => {
                            const matchedCategory = catListProducts.find(
                              (clPitem) => clPitem.name === item.hsecCategoriaCat?.nodes[0]?.slug
                            );

                            return matchedCategory ? (
                              <SwiperProducts key={matchedCategory.name} data={matchedCategory.list} />
                            ) : (
                              <SwiperProductsLoad />
                            );
                          })()
                        ) : (
                          <SwiperProductsLoad />
                        )}
                      </div>
                  </Container>
                </section>
              )
            }else if(item.__typename === 'PageHomeIntroSeccionesHsecPubLayout'){
              return (
                <section className="secBox homeProm">
                  <Container>
                    <div className="inlineBlock homeProm">
                        <SwiperPub data={item.hsecPubList} />
                    </div>
                  </Container>
                </section>
              )
            }else if(item.__typename === 'hsec_tranos'){
              return (
                <section className="secBox homeTrabaja">
                  <Container>
                    <div className="inlineFlex homeTrabajaBox">
                      <div className="txt" dangerouslySetInnerHTML={{__html: item.hsec_tranos_txt}}></div>
                      <figure>
                        {item.hsec_tranos_img &&
                          <img src={item.hsec_tranos_img} alt="" />
                        }
                      </figure>
                    </div>
                  </Container>
                </section>
              )
            }else if(item.__typename === 'PageHomeIntroSeccionesHsecExplorarLayout'){
              return (
                <section className="secBox homeCategorias">
                  <Container>
                      <div className="inlineBlock homeCategoriasBox">
                        <div className="titleSections">
                          <h2>{item.hsecExplorarTitulo ? item.hsecExplorarTitulo : '--'}</h2>
                        </div>
                        {catList &&
                          <SwiperHomeCategories data={catList} />
                        }
                      </div>
                  </Container>
                </section>
              )
            }
          })}

          <HomeNewslatter 
            handleClose={handleClose} 
            infoConf={infoConf}
          />
          
        </LayoutCont>
      </LayoutPages>
    
  )
};

export default HomePage;
