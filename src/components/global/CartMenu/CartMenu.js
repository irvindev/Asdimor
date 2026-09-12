import { useState, useEffect } from "react";
import './CartMenu.scss';
import { useAuthContext } from './../../../context/authContext';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CloseIcon from '@mui/icons-material/Close';

import BlockAnimate from './../../util/BlockAnim/BlockAnim';
import ProductInCart from './../../Cart/ProductInCart/ProductInCart';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import { useNavigate } from "react-router";

import Modal from '@mui/material/Modal';

import { isFridayToSaturdayRange } from './openTienda';

const CartMenu = (props) => {

  const { cartItems, cartMenuOpen,setCartMenuOpen,emptyCart, totals, infoGeneral } = useAuthContext();
  let navigate = useNavigate();

  const [ freeDelivery, setFreeDelivery ]  = useState(150);
  const [visible, setVisible] = useState(false);

  const totalPayment = cartItems.reduce(
    (previous,current) => {
        const totalTemp = (previous + parseFloat(current.price)) * current.amount ;
        return totalTemp;
  },0);

  const cartMenuClose  = () =>{
    setCartMenuOpen(false)
  }

  const toCartPage =() =>{
    setCartMenuOpen(false);
    navigate('/checkout');
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const checkTime = () => {
      setVisible(isFridayToSaturdayRange());
    };


    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
    
  }, [infoGeneral]);
  
  return (
    <div className={cartMenuOpen ? 'cartMenuCont cartMenuContAct' : 'cartMenuCont'}>
      <div onClick={cartMenuClose} className="cartMenuSkip"></div>
      <div className={'cartMenuBox'}>
        <div onClick={()=>console.log(cartItems)} className="inlineFlex cmTitle">
          <h3>
            <div className="ico">
              <ShoppingCartOutlinedIcon/> 
            </div>
            Carrito
          </h3>
          <div className="cmClose" onClick={cartMenuClose}>
            CERRAR <ArrowForwardIcon />
          </div>
        </div>
        <div className="inlineFlex cmBody">
          {cartItems && cartItems.length && cartItems.length > 0 ?
            <BlockAnimate
                claseStyle={'inlineFlex cmProductList'}
                stateParam={cartItems}
                unicId={'cmProductList'}
            >
              {cartItems.map((item)=>(
                <ProductInCart product={item} />
              ))}
            </BlockAnimate>
          :
            <BlockAnimate
                claseStyle={'inlineFlex cmProductList'}
                stateParam={cartItems}
                unicId={'cmProductList'}
            >
              <div className="cmProductEmpty">
                <PriorityHighRoundedIcon/> 
                <p>El carrito esta vacío.</p>
              </div>
            </BlockAnimate>
          }

          <div className="cmNote">

            {totalPayment > freeDelivery ?
              <p><DeliveryDiningIcon/> Felicitaciones tu delivery saldra gratis. *Solo para Lima y Callao</p>
            :
              <p><DeliveryDiningIcon/> Estás a <strong>S/ {  freeDelivery - totalPayment }</strong> de obtener Delivery gratis. *Válido en Lima y Callao.</p>
            }
          </div>
          <div className="inlineFlex cmBtnBox">
            {visible ?
              <div onClick={ handleOpen} className="btn" >
                <ShoppingCartCheckoutOutlinedIcon/> Ir a pagar - <strong>S/ {totals  ? totals.subtotal  : '0'}</strong> 
              </div>
            :            
              <div onClick={toCartPage} className="btn" >
                <ShoppingCartCheckoutOutlinedIcon/> Ir a pagar - <strong>S/ {totals  ? totals.subtotal  : '0'}</strong> 
              </div>
            }
            <div className="btn btnClear" onClick={emptyCart}>
              <DeleteSweepOutlinedIcon/> Limpiar carrito 
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <div className="inlineBlock cartNoteCloseBox">
          <div className="closedPopup" onClick={handleClose}>
            <CloseIcon/>
          </div>
          <div className="titleSections">
            <h2>Hoy descansamos</h2>
          </div>
          {infoGeneral && infoGeneral.configuracionesFields && infoGeneral.configuracionesFields.confPopup &&
            <div className="txt" dangerouslySetInnerHTML={{__html: infoGeneral.configuracionesFields.confPopup}} ></div>
          }
        </div>
      </Modal>
    </div>
  )
};

export default CartMenu;
