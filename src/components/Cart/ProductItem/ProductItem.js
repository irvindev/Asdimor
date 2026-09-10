import React from "react";
import './ProductItem.scss';
import product from '../../../assets/img/home_intro1.png';

import icoStart from '../../../assets/img/ico_start.svg';

import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

import AddIcon from '@mui/icons-material/Add';

import { Link } from "react-router";
import { useAuthContext } from './../../../context/authContext';

const ProductItem = ({data}) => {

  const {addItemToCart,setCartMenuOpen}=useAuthContext();

  const addProdCart = ()=>{
    addItemToCart(data)
    setCartMenuOpen(true)
  }
  
  return (
    <div className="productItem">
        <h4>{data.name}</h4>
        <div className="inlineBlock piStartList">
          <img src={icoStart} alt="" />
          <img src={icoStart} alt="" />
          <img src={icoStart} alt="" />
          <img src={icoStart} alt="" />
          <img src={icoStart} alt="" />
        </div>
        <div className="inlineFlex priceBox">
          {data.categories && data.categories.length  > 0 &&
            <div className="cat">
              {data.categories[0].name}
            </div>
          }
          <div className="price">
            S/ {data.price}
          </div>
        </div>
        <figure>
          {data.images ?
            <img src={data.images[0].src} alt="" />
          :
            <img src={product} alt="" />
          
          }
          <div className="inlineFlex btnBox">
            <Link
              className="inlineFlex btn"
              to={'/tienda/'+data.slug}
            >
              Ver detalle<AddIcon/>
            </Link>
            <button className="inlineFlex btn" onClick={addProdCart}> Agregar <LocalMallOutlinedIcon/> </button>
          </div>
        </figure>
        
    </div>
  )
};

export default ProductItem;
