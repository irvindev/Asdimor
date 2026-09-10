import {useState,useEffect} from 'react';
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
import ProductItemLoad from '../../components/Cart/ProductItem/ProductItemLoad';

import Sticky from 'react-sticky-el';
import { useAuthContext } from '../../context/authContext';

import ErrorIcon from '@mui/icons-material/Error';

function valuetext(value) {
  return `${value}°C`;
}

const TiendaPage = (props) => {

  const [range, setRange] = useState([0, 250]);
  const { allProducts, baseUrl, keysWc } = useAuthContext();
  const breadCrumb = [{name:'Inicio',link:'/'},{name:'Tienda'}]

  const handleChange = (event, newValue) => {
    setRange(newValue);
    changeFiltersSYP(searchTxt);
  };

  const [productList,setProductList] = useState();
  const [productListGn,setProductListGn] = useState();
  const [productChkFilter,setProductChkFilter] = useState();
  const [index, setIndex] = useState(12);
  const initialPosts = slice(productListGn, 0, index);

  const getProducts = () =>{
    setTimeout(() => {
      setProductList(allProducts)
      setProductListGn(allProducts)
    }, 1000);
  }

  const [catList,setCatList] = useState();
  const getProdCat = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/product_cat?per_page=100')
      .then((resp)=>{
        setCatList(resp.data)
      }).catch((err)=>{
        console.log(err)
      })
  }

  const [prodList,setProdList] = useState();
  const getProd = () =>{
    axios.get(baseUrl+'wp-json/wp/v2/producto?per_page=100')
      .then((resp)=>{
        setProdList(resp.data)
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
        setEncuaList(resp.data)
      }).catch((err)=>{
        console.log(err)
      })
  }

  const [catChk,setCatChk] = useState({
    cat:[],
    prod:[],
    med:[],
    enc:[]
  });
  
  const [filterCats,setFilterCats] = useState({
    productos:null,
    medidas:null,
    encuadernacion:null
  });

  const changeChk = (e,tax) =>{

    let catTmp = catChk.cat;
    let prodTmp = catChk.prod;
    let medTmp = catChk.med;
    let encTmp = catChk.enc;

    if(tax==='cat'){
      if(e.target.checked){
        setCatChk({...catChk,cat:[...catChk.cat,parseInt(e.target.value)]});
        catTmp.push(parseInt(e.target.value));
      }else{
        const catTmpRem = catChk.cat.filter((item) => item !== parseInt(e.target.value));
        setCatChk({...catChk,cat:catTmpRem});
        catTmp=catTmpRem;
      }
    }

    if(tax==='prod'){
      if(e.target.checked){
        setCatChk({...catChk,prod:[...catChk.prod,parseInt(e.target.value)]});
        prodTmp.push(parseInt(e.target.value));
      }else{
        const prodTmpRem = catChk.prod.filter((item) => item !== parseInt(e.target.value));
        setCatChk({...catChk,prod:prodTmpRem});
        prodTmp=prodTmpRem;
        
      }
    }

    if(tax==='med'){

      const tmpMedClick = formatList.map((item)=>{
        if(item.id === e){
          return ({id:item.id,name:item.name,description:item.description,click:!item.click})
        }else{
          return ({id:item.id,name:item.name,description:item.description,click:false})
        }
      })

      setFormatList(tmpMedClick);

      medTmp = tmpMedClick.map((item)=>{
        if(item.click === true){
          return item.id
        }
      })
      setCatChk({...catChk,med:medTmp});
    }

    if(tax==='enc'){
      if(e.target.checked){
        setCatChk({...catChk,enc:[...catChk.enc,parseInt(e.target.value)]});
        encTmp.push(parseInt(e.target.value));
      }else{
        const encTmpRem = catChk.enc.filter((item) => item !== parseInt(e.target.value));
        setCatChk({...catChk,enc:encTmpRem});
        encTmp=encTmpRem;
      }
    }


    if(productList && productList.length && productList.length > 0){
      
      const filtrados = productList.filter(p =>
        p.category_ids.some(cat => catTmp.includes(cat))
      );

      const filtrados2 = filtrados.filter(p =>
        p.tax_productos.some(cat => prodTmp.includes(cat))
      );

      const filtrados3 = filtrados2.filter(p =>
        p.tax_medidas.some(cat => medTmp.includes(cat))
      );

      const filtrados4 = filtrados3.filter(p =>
        p.tax_encuadernacion.some(cat => encTmp.includes(cat))
      );

      if(tax==='cat'){
        if(catTmp.length > 0){
          setProductListGn(filtrados);
          
        }else{
          setProductListGn(productList);
        }
      }
      if(tax==='prod'){
        if(prodTmp.length > 0){
          setProductListGn(filtrados2);
          setProductChkFilter(filtrados2)
        }else{
          setProductListGn(productList);
          setProductChkFilter(productList)
        }
      }
      if(tax==='med'){
        if(medTmp.length > 0){
          setProductListGn(filtrados3);
          setProductChkFilter(filtrados3);
        }else{
          setProductListGn(productList);
          setProductChkFilter(productList);
        }
      }
      if(tax==='enc'){
        if(encTmp.length > 0){
          setProductListGn(filtrados4);
          setProductChkFilter(filtrados4);
        }else{
          setProductListGn(productList);
          setProductChkFilter(productList);
        }
      }

      const productosList = filtrados.flatMap(p => p.tax_productos);
      const prodArrayUniq = [...new Set([...productosList])];

      const medidasList = filtrados.flatMap(p => p.tax_medidas);
      const medArrayUniq = [...new Set([...medidasList])];

      const encuadernacionList = filtrados.flatMap(p => p.tax_encuadernacion);
      const encArrayUniq = [...new Set([...encuadernacionList])];

      setFilterCats({
        ...filterCats,
        productos:prodArrayUniq,
        medidas:medArrayUniq,
        encuadernacion:encArrayUniq
      });
      
    }
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
    if (newIndex >= productList.length) {
      //setIsCompleted(true)
    } else {
      //setIsCompleted(false)
    }
  }

  const [searchTxt,setSearchTxt] = useState('');

  const changeFiltersSYP = (stxt) =>{
    if(stxt === '' ){
      //const tmpList = productChkFilter;
      const prodListTmp2 = productListGn.filter(
          ({ price }) => parseFloat(price) >= range[0] && parseFloat(price) <= range[1]
      );
      setProductListGn(prodListTmp2)
    }else{
      const prodListTmp = productListGn.filter(
        ({ name }) =>
          name.toLowerCase().includes(stxt.toLowerCase())
        );

      const prodListTmp2 = prodListTmp.filter(
          ({ price }) => parseFloat(price) >= range[0] && parseFloat(price) <= range[1]
      );
      setProductListGn(prodListTmp2)
    }
  }

  const changeSearchBox = (e) =>{
    const searchValue = e.target.value;
    setSearchTxt(searchValue)
    changeFiltersSYP(searchValue);
  }

  const [tmpFilterHome,setTmpFilterHome] = useState();
  const simulateFilterClick = () => {
    const filterId = localStorage.getItem("filter");
    setTmpFilterHome(filterId)
    if (!filterId) return;

    const checkbox = document.querySelector(
      `label[data-id="${filterId}"] input[type="checkbox"]`
    );

    if (checkbox) {
      checkbox.click(); // simula el click real
    }
  };

  const removeFilter = (id) =>{

    const checkbox = document.querySelector(
      `label[data-id="${id}"] input[type="checkbox"]`
    );

    if (checkbox) {
      checkbox.click(); // simula el click real
    }
  }

  useEffect(()=>{
    getProducts();
    getProdCat();
    getProd();
    getFormat();
    getEncua();
  },[allProducts]);

  useEffect(()=>{

    if (catList && catList.length) {
      setTimeout(() => {
        simulateFilterClick();  
      }, 1000);
      setTimeout(() => {
        localStorage.removeItem('filter');
      }, 3000);
      
    }

  },[catList]);

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
              <Sticky boundaryElement=".catPageMain" topOffset={-130} hideOnBoundaryHit={false} className={'inlineFlex tpmSidebarCont'}  stickyClassName={'tpmSidebarContAct'}>
                <div className="inlineFlex tpmPaper tpmSidebar">
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Encuentra rápido </h3>
                    <div className="inlineBlock tpmsSearchbox">
                      <FormControl fullWidth variant="outlined">
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={'text'}
                          value={searchTxt}
                          onChange={changeSearchBox}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                          //label="Password"
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Rango de precios:</h3>
                    <div className="tpmsRange">
                      <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={range}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        max={250}
                      />
                    </div>
                    <div className="inlineFlex tpmsRangeLabel">
                      <div className="tpmsRangeLabelItem">
                        <small>Desde</small>
                        <p>S/. {range ? range[0]: 0}</p>
                      </div>
                      <div className="tpmsRangeLabelItem">
                        <small>Desde</small>
                        <p>S/. {range ? range[1]: 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Categorías:</h3>
                    <div className="inlineBlock tpmsChecklist">
                      <FormGroup
                      >
                        {catList && catList.length && catList.map((item)=>{
                          return(
                            <FormControlLabel onChange={(e)=>changeChk(e,'cat')} data-id={item.id} value={item.id} control={<Checkbox />} label={item.name} />
                          )
                        })}
                        {false &&
                          <FormControlLabel control={<Checkbox defaultChecked />} label="Categoria #1" />
                        }
                      </FormGroup>
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Producto:</h3>
                    <div className="inlineBlock tpmsChecklist">
                      {filterCats.productos && filterCats.productos.length ?
                        <FormGroup>
                          {prodList && prodList.length && prodList.map((item)=>{
                            return filterCats.productos.map((sItem)=>{
                              if(sItem === item.id){
                                return <FormControlLabel  onChange={(e)=>changeChk(e,'prod')} value={item.id} control={<Checkbox />} label={item.name} />
                              }
                            })
                          })}
                        </FormGroup>
                      :
                        <FormGroup>
                          {prodList && prodList.length && prodList.map((item)=>{

                              return(
                                <FormControlLabel  onChange={(e)=>changeChk(e,'prod')} value={item.id} control={<Checkbox />} label={item.name} />
                              )
                          })}
                        </FormGroup>
                      }
                    </div>
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Medidas:</h3>
                    {filterCats.medidas && filterCats.medidas.length ?
                      <div className="inlineFlex tpmsFormato">
                        {formatList && formatList.length && formatList.map((item)=>{
                          return filterCats.medidas.map((sItem)=>{
                            if(sItem === item.id){
                              return  <div 
                                        className={item.click === true ? 'tpmsFormatoItem tpmsFormatoItemAct' : 'tpmsFormatoItem' }
                                        onClick={()=>changeChk(item.id,'med')}
                                      >
                                        <figure>
                                          <img src={icoFormart} alt="" />
                                        </figure>
                                        <div className="txt">
                                          <p>{item.name}</p>
                                          <small>{item.description}</small>
                                        </div>
                                      </div>
                            }
                          })
                        })}
                      </div>
                    :
                      <div className="inlineFlex tpmsFormato">
                        {formatList && formatList.length && formatList.map((item)=>{
                          return(
                            <div 
                              className={item.click === true ? 'tpmsFormatoItem tpmsFormatoItemAct' : 'tpmsFormatoItem' }
                              onClick={()=>changeChk(item.id,'med')}
                            >
                              <figure>
                                <img src={icoFormart} alt="" />
                              </figure>
                              <div className="txt">
                                <p>{item.name}</p>
                                <small>{item.description}</small>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    }
                  </div>
                  <div className="inlineFlex tpmSidebarItem">
                    <h3>Encuadernacion:</h3>
                          
                    <div className="inlineBlock tpmsChecklist">
                      {filterCats.encuadernacion && filterCats.encuadernacion.length ?
                        <FormGroup>
                          {encuaList && encuaList.length && encuaList.map((item)=>{

                            return filterCats.encuadernacion.map((sItem)=>{
                              if(sItem === item.id){
                                return(
                                  <FormControlLabel onChange={(e)=>changeChk(e,'enc')} value={item.id} control={<Checkbox />} label={item.name} />
                                )
                              }
                            })
                          })}
                        </FormGroup>
                      :
                        <FormGroup>
                          {encuaList && encuaList.length && encuaList.map((item)=>{
                            return(
                              <FormControlLabel onChange={(e)=>changeChk(e,'enc')} value={item.id} control={<Checkbox />} label={item.name} />
                            )
                          })}
                        </FormGroup>
                      }
                    </div>
                  </div>
                </div>
              </Sticky>
              {initialPosts && initialPosts.length ?
                <div className="inlineFlex tpmProdList">
                  {initialPosts.map((item)=>(
                    <div className="tpmProdItem">
                      <ProductItem data={item}/>
                    </div>
                  ))}
                {initialPosts.length > 11 ?
                  <div className="btnCenter inlineFlex">
                      <a onClick={(e)=>moreProducts(e)} className="btnPrimary">
                        VER MÁS PRODUCTOS
                      </a>
                  </div>
                :
                  <div className="btnCenter inlineFlex">
                    <a onClick={()=>removeFilter(tmpFilterHome)} className="btnPrimary">
                      VER MÁS PRODUCTOS
                    </a>
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
