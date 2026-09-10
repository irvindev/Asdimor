import './respuesta.scss';

import CloseIcon from '@mui/icons-material/Close';

import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import { Link } from 'react-router';

const RespMpModal = ({closModal,respPayment}) => {
  return (
    <div className={respPayment === 'approved' || respPayment=== 200 || respPayment=== 201 ? 'inlineFlex checkoutPaymentResp checkoutPaymentRespValid' : 'inlineFlex checkoutPaymentResp' }>
        <div className="closedPopup" onClick={closModal}>
            <CloseIcon/>
        </div>
        {respPayment === 'approved' || respPayment=== 200 || respPayment=== 201  ?
            <div className="inlineFlex title">
                
                <h2>¡Gracias el pago fue exitoso!</h2>
                <CreditScoreOutlinedIcon />
                <p>Tu transacción se ha completado correctamente. <br />En breve recibirás un correo de confirmación <br />con los detalles de tu compra.</p>
            </div>
        :
            <div className="inlineFlex title">
                <h2>Lo sentimos</h2>
                <ReportOutlinedIcon />
                <p>Intentarlo con otra <br />tarjeta y/o metodo de pago.</p>
            </div>
        }
        {respPayment === 'approved' || respPayment=== 200 || respPayment=== 201 ?
            <div className="inlineFlex cprBtnBox">
                <Link to='/mi-cuenta/ordenes'  className="btnPrimary">
                    Mis compras
                </Link>
                <Link to='/tienda'  className="btnPrimary">
                    Seguir comprando
                </Link>
            </div>
        :
            <div className="inlineFlex cprBtnBox">
                <button onClick={closModal} className="btnPrimary">
                    Volver
                </button>
            </div>
        }
    </div>
  )
};

export default RespMpModal;
