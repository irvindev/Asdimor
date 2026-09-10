import { useState, useEffect, useMemo } from 'react';
import LayoutCont from '../../components/LayoutCont/LayoutCont';
import LayoutPages from '../../components/LayoutPages/LayoutPages';

import Container from '@mui/material/Container';
import BreadcrumbComp from '../../components/global/breadcrumb/breadcrumb';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import SearchIcon from '@mui/icons-material/Search';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { slice } from 'lodash'

import './tienda.scss';

import icoFormart from '../../assets/img/ico_format.png';
import ProductItem from '../../components/Cart/ProductItem/ProductItem';

import axios from 'axios';
import ProductItemLoad from './../../components/Cart/ProductItem/ProductItemLoad';

import Sticky from 'react-sticky-el';
import { useAuthContext } from './../../context/authContext';

import ErrorIcon from '@mui/icons-material/Error';
import { faker } from '@faker-js/faker';

import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useLocation } from 'react-router';

function valuetext(value) {
  return `${value}°C`;
}

const TiendaPage = (props) => {

  const { allProducts, baseUrl } = useAuthContext();
  const breadCrumb = [{name:'Inicio',link:'/'},{name:'Tienda'}]
  

  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filters, setFilters] = useState({
    categories: [],
    productos: [],
    medidas: [],
    encuadernacion: []
  });

  const [searchText, setSearchText] = useState('');
  const [priceRange, setPriceRange] = useState([0, 250]);

  const [index, setIndex] = useState(12);
  const initialPosts = slice(filteredProducts, 0, index);

  const getProducts = () =>{
    setTimeout(() => {
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    }, 500);
  }

  const [catList,setCatList] = useState();
  const getProdCat = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/product_cat?per_page=100')
      .then((resp)=>{
        setCatList(resp.data);
      }).catch((err)=>{
        console.log(err)
      })
  }

  const [prodList,setProdList] = useState();
  const getProd = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/producto?per_page=100')
      .then((resp)=>{
        setProdList(resp.data);
      }).catch((err)=>{
        console.log(err)
      })
  }

  const [formatList,setFormatList] = useState();
  const getFormat = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/medidas?per_page=100')
      .then((resp)=>{
        //setFormatList(resp.data)
        const formatListTmp =[];
        resp.data.map((item)=>{
          formatListTmp.push({id:item.id,name:item.name,description:item.description,click:false})
        })
        setFormatList(formatListTmp)
      }).catch((err)=>{
        console.log(err)
      })
  }

  const [encuaList,setEncuaList] = useState();
  const getEncua = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/encuadernacion?per_page=100')
      .then((resp)=>{
        setEncuaList(resp.data);
      }).catch((err)=>{
        console.log(err)
      })
  }

  const moreProducts = (e) =>{
    setIndex(index + 12)
    const topTmp = e.currentTarget.offsetTop;
    if(window.screen.width  > 767){
      var newIndex = index + 12;

      setTimeout(() => {
        window.scrollTo({top: topTmp, left: 0, behavior: 'smooth' })  
      }, 350);
      
    }else{
      var newIndex = index + 12;
    }

  }

  useEffect(()=>{
    if(allProducts?.length){
      getProducts();
    }
  },[allProducts]);

  useEffect(()=>{
    getProdCat();
    getProd();
    getFormat();
    getEncua();
  },[]);

  const availableFilters = useMemo(() => {
    const cats = new Set();
    const prods = new Set();
    const meds = new Set();
    const encs = new Set();

    if(filteredProducts){
      filteredProducts.forEach(p => {
        p.category_ids?.forEach(id => cats.add(id));
        p.tax_productos?.forEach(id => prods.add(id));
        p.tax_medidas?.forEach(id => meds.add(id));
        p.tax_encuadernacion?.forEach(id => encs.add(id));
      });
    }

    return {
      categories: [...cats],
      productos: [...prods],
      medidas: [...meds],
      encuadernacion: [...encs]
    };
  }, [filteredProducts]);

  useEffect(() => {
    let result = products;

    // 🔎 Texto
    if (searchText.trim()) {
      const txt = searchText.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(txt)
      );
    }

    // 💰 Precio
    if(result && result.length) {
    result = result.filter(p => {
      const price = parseFloat(p.sale_price || p.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });
    }

    // 📂 Categorías
    if (filters.categories.length) {
      result = result.filter(p =>
        p.category_ids?.some(id =>
          filters.categories.includes(id)
        )
      );
    }

    // 📦 Productos
    if (filters.productos.length) {
      result = result.filter(p =>
        p.tax_productos?.some(id =>
          filters.productos.includes(id)
        )
      );
    }

    // 📐 Medidas
    if (filters.medidas.length) {
      result = result.filter(p =>
        p.tax_medidas?.some(id =>
          filters.medidas.includes(id)
        )
      );
    }

    // 📎 Encuadernación
    if (filters.encuadernacion.length) {
      result = result.filter(p =>
        p.tax_encuadernacion?.some(id =>
          filters.encuadernacion.includes(id)
        )
      );
    }

    setFilteredProducts(result);
  }, [products, filters, searchText, priceRange]);

  const toggleFilter = (type, id) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter(x => x !== id)
        : [...prev[type], id]
    }));
  };

  useEffect(() => {
    setFilters(prev => {
      const next = {
        categories: prev.categories.filter(id =>
          availableFilters.categories.includes(id)
        ),
        productos: prev.productos.filter(id =>
          availableFilters.productos.includes(id)
        ),
        medidas: prev.medidas.filter(id =>
          availableFilters.medidas.includes(id)
        ),
        encuadernacion: prev.encuadernacion.filter(id =>
          availableFilters.encuadernacion.includes(id)
        )
      };

      const isSame =
        prev.categories.length === next.categories.length &&
        prev.productos.length === next.productos.length &&
        prev.medidas.length === next.medidas.length &&
        prev.encuadernacion.length === next.encuadernacion.length;

      return isSame ? prev : next;
    });
  }, [availableFilters]);

  const [respFilter,setRespFilter] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {

    if ( state?.categoryId) {
      setFilters(prev => ({
        ...prev,
        categories: [state.categoryId]
      }));
    }

  }, [
    state,
    catList,
    prodList,
    formatList,
    encuaList
  ]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);


  return (
    
    <LayoutPages classComp={'tiendaPageCont'}>
      <LayoutCont keyPage={'TiendaPage'}>
        <section className="secBox tiendaPageBox">
          <Container>
            <BreadcrumbComp data={breadCrumb} />
            <div className="titleSections">
              <h1>Productos</h1>
            </div>
            <div className="inlineFlex catPageMain">
              {!isDesktop &&
              <div onClick={()=>!setRespFilter(!respFilter)} className={respFilter ? "tpmPaper tpmBtnFiltros tpmBtnFiltrosAct" : "tpmPaper tpmBtnFiltros"}>
                <FilterListIcon/> Ver filtros
                <div className="arrow">
                  <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                </div>
              </div>
              }
              {respFilter &&
              <Sticky 
                className={'inlineFlex tpmSidebarCont'}  
                stickyClassName={'tpmSidebarContAct'}
                boundaryElement=".catPageMain" 
                //hideOnBoundaryHit={false} 
                topOffset={-130} 
              >
                <div className="inlineFlex tpmPaper tpmSidebar">
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Encuentra rápido </h3>
                    <div className="inlineBlock tpmsSearchbox">
                      <FormControl fullWidth variant="outlined">
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={'text'}
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Rango de precios:</h3>
                    <div className="tpmsRange">
                      <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={priceRange}
                        onChange={(e, v) => setPriceRange(v)}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        max={250}
                      />
                    </div>
                    <div className="inlineFlex tpmsRangeLabel">
                      <div className="tpmsRangeLabelItem">
                        <small>Desde</small>
                        <p>S/. {priceRange ? priceRange[0]: 0}</p>
                      </div>
                      <div className="tpmsRangeLabelItem">
                        <small>Desde</small>
                        <p>S/. {priceRange ? priceRange[1]: 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Categorías:</h3>
                    <div className="inlineBlock tpmsChecklist">
                      <FormGroup
                      >
                        {availableFilters && 
                        availableFilters.categories && 
                        availableFilters.categories.length && 
                        availableFilters.categories.map((id,index) => {

                          let nameCat = '';
                          if(catList){
                            catList.map((item)=>{
                              if(item.id === id){
                                nameCat = item.name
                              }
                            })
                          }

                          return (
                            <FormControlLabel 
                              key={faker.id+'cat-'+index}
                              control={
                                <Checkbox
                                  checked={filters.categories.includes(id)}
                                  onChange={() =>
                                    setFilters(prev => ({
                                      ...prev,
                                      categories: prev.categories.includes(id)
                                        ? prev.categories.filter(x => x !== id)
                                        : [...prev.categories, id]
                                    }))
                                  }
                                />
                              } 
                              label={nameCat}
                            />
                          )
                        })}
                      </FormGroup>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3 onClick={()=>console.log(prodList)}>Producto:</h3>
                    <div className="inlineBlock tpmsChecklist">
                      <FormGroup>

                        {availableFilters && 
                        availableFilters.productos && 
                        availableFilters.productos.length && 
                        availableFilters.productos.map((id,index) => {

                          let nameCat = '';
                          if(prodList){
                            prodList.map((item)=>{
                              if(item.id === id){
                                nameCat = item.name
                              }
                            })
                          }

                          return(
                            <FormControlLabel 
                              key={faker.id+'pro-'+index}
                              control={
                                <Checkbox
                                  checked={filters.productos.includes(id)}
                                  onChange={() =>
                                    setFilters(prev => ({
                                      ...prev,
                                      productos: prev.productos.includes(id)
                                        ? prev.productos.filter(x => x !== id)
                                        : [...prev.productos, id]
                                    }))
                                  }
                                />
                              } 
                              label={nameCat}
                            />
                          )
                        })}
                      </FormGroup>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3 onClick={()=>console.log(formatList)}>Medidas:</h3>

                      <div className="inlineFlex tpmsFormato">

                        {availableFilters && 
                        availableFilters.medidas && 
                        availableFilters.medidas.length && 
                        availableFilters.medidas.map((id,index) => {
                          const isActive = filters.medidas.includes(id);

                          let nameCat = '';
                          let descCat = '';
                          if(formatList){
                            formatList.map((item)=>{
                              if(item.id === id){
                                nameCat = item.name
                                descCat = item.description
                              }
                            })
                          }

                          return (
                            <div
                              key={faker.id+'med-'+index}
                              className={
                                isActive
                                  ? 'tpmsFormatoItem tpmsFormatoItemAct'
                                  : 'tpmsFormatoItem'
                              }
                              onClick={() => toggleFilter('medidas', id)}
                            >
                              <figure>
                                <img src={icoFormart} alt="" />
                              </figure>

                              <div className="txt">
                                <p>{nameCat}</p>
                                <small>{descCat}</small>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3 >Encuadernacion:</h3>
                          
                    <div className="inlineBlock tpmsChecklist">

                      <FormGroup>
                        {availableFilters && 
                        availableFilters.encuadernacion && 
                        availableFilters.encuadernacion.length && 
                        availableFilters.encuadernacion.map((id,index) => {

                          let nameCat = '';
                          if(encuaList){
                            encuaList.map((item)=>{
                              if(item.id === id){
                                nameCat = item.name
                              }
                            })
                          }
                          return(
                            <FormControlLabel 
                              key={faker.id+'enc-'+index}
                              control={
                                <Checkbox
                                  checked={filters.encuadernacion.includes(id)}
                                  onChange={() =>
                                    setFilters(prev => ({
                                      ...prev,
                                      encuadernacion: prev.encuadernacion.includes(id)
                                        ? prev.encuadernacion.filter(x => x !== id)
                                        : [...prev.encuadernacion, id]
                                    }))
                                  }
                                />
                              }
                              label={nameCat}
                            />
                          )
                        })}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </Sticky>
              }
              {initialPosts && initialPosts.length ?
                <div className="inlineFlex tpmProdList">
                  {initialPosts.map((item,index)=>(
                    <div 
                      key={faker.id+'product-'+index}
                      className="tpmProdItem">
                      <ProductItem data={item}/>
                    </div>
                  ))}
                {initialPosts.length > 11 ?
                  <div className="btnCenter inlineFlex">
                      <button onClick={(e)=>moreProducts(e)} className="btnPrimary">
                        VER MÁS PRODUCTOS
                      </button>
                  </div>
                :
                  <div className="btnCenter inlineFlex">
                    <button  className="btnPrimary">
                      VER MÁS PRODUCTOS
                    </button>
                  </div>
                }
                </div>
              :initialPosts.length >= 0 && false ?
                <div className="inlineBlock tpmProdList">
                  <div className="tpmProdEmpty">
                    
                    <p><ErrorIcon /> lo sentimos no encontramos resultados</p>
                  </div>
                </div>
              :
                <div className="inlineFlex tpmProdList">
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                  <div className="tpmProdItem">
                    <ProductItemLoad/>
                  </div>
                </div>
              }
            </div>
          </Container>
          
        </section>
      </LayoutCont>
    </LayoutPages>
    
  )
};

export default TiendaPage;
