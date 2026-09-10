import { useState, useEffect } from "react";

import './Payment.scss';

import icoYape from '../../../assets/img/ico_yape.png';
import { useAuthContext } from './../../../context/authContext';

import icoVisa from '../../../assets/img/ico_visa.png';
import icoMastercard from '../../../assets/img/ico_mastercard.png';
import icoAmericanExpress from '../../../assets/img/ico_americanexpress.png';

import Modal from '@mui/material/Modal';

import { useNavigate } from "react-router";

import paymentSuccess from '../../../assets/img/ico_payment_cesta.png';
import CheckoutYapeForm from './../mercadopago/yape';
import CheckoutCardFormTemporal from './../mercadopago/card2';


const CheckoutFormPayment = ({backForm,shippingData}) => {

  const [ payment, setPayment ] = useState();
  const { cartItems, baseUrl, keysWc, dataUser, token, totals} = useAuthContext();
  let navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const changePayment = (v) =>{
    setPayment(v);
  }

  return (
    <div className={'checkoutFormPayment'}>
      <div className="cfpList">

        <div onClick={()=>changePayment(3)} className={payment === 3 ? 'cfpItem cfpItemAct': 'cfpItem'}>
          <div className="inlineFlex cfpItemBox">
            <figure className='icon'>
              <img src={icoYape} alt="" />
            </figure>
            <span className={'total'}>Yapear - 
              <strong>S/ 
                {totals ? totals.total.toFixed(2) : '--' }
                </strong>
            </span>
            <div className="iconCheck">
            </div>
          </div>

          {payment === 3 &&
            <div className="inlineFlex cfpItemDates">
              <CheckoutYapeForm totalPayment={ totals ? totals.total : '--' } backForm={backForm} shippingData={shippingData} />
            </div>
          }
        </div>

        <div onClick={()=>changePayment(4)} className={payment === 4 ? 'cfpItem cfpItemTrans cfpItemAct': 'cfpItem cfpItemTrans'}>
          <div className="inlineFlex cfpItemBox">
            <figure className='iconList'>
              
              <img src={icoMastercard} alt="" />
              <img src={icoAmericanExpress} alt="" />
              <img src={icoVisa} alt="" />
            </figure>
            <span className={'total'}>Pago con tarjeta - <strong> S/ {totals ? totals.total.toFixed(2) : '--' }</strong></span>
            <div className="iconCheck">

            </div>
          </div>
          {payment === 4 &&
            <div className="inlineFlex cfpItemDates">
              <CheckoutCardFormTemporal  totalPayment={ totals ? totals.total : '--'  }  backForm={backForm} shippingData={shippingData}/>
            </div>
          }
        </div>
      </div>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="paymentModalBox">
          <h3>Bien {dataUser ? dataUser.firstName : '--'}, tu compra a sido un exito</h3>
          <figure>
            <img src={paymentSuccess} alt="" />
          </figure>
        </div>
      </Modal>

    </div>
  )
};

export default CheckoutFormPayment;
