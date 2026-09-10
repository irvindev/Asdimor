import { useState, useEffect } from "react";
import { Link } from 'react-router';

import './checkout.scss';

import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';
import { useAuthContext } from './../../context/authContext';

import CheckoutFormUser from './../../components/checkout/Forms/User';
import CheckoutFormShipping from './../../components/checkout/Forms/Shipping';
import CheckoutFormPayment from './../../components/checkout/Forms/Payment';
import ProductInCart from './../../components/Cart/ProductInCart/ProductInCart';

import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';

import prodNotfoundImg from '../../assets/img/prod_not_found.png';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import CheckoutFormShippingEdit from './../../components/checkout/Forms/ShippingEdit';
import Sticky from 'react-sticky-el';


function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <ShoppingCartOutlinedIcon />,
    2: <AssignmentIndOutlinedIcon />,
    3: <DeliveryDiningOutlinedIcon />,
    4: <PaymentOutlinedIcon />,
  };

  return (
      icons[String(props.icon)]
  );
}

const CheckoutPage = (props) => {

    const { cartItems, token, totals } = useAuthContext();
    const [ editUd, setEditUd ] = useState(false);
    const [ editShip, setEditShip ] = useState(false);
    const [ shippingData, setShippingData ] = useState();


    const breadCrumb = [
        {name:'Inicio',link:'/'},
        {name:'Checkout'},
    ]

    // Total
    const totalPayment = cartItems.reduce(
        (previous,current) => {
            const totalTemp = (previous + parseFloat(current.price)) * current.amount ;
            return totalTemp;
    },0);

    // Stepper
    const steps = [
        {label: 'Carrito'},
        {label: 'Datos'},
        {label: 'Envío',description:'---sdad'},
        {label: 'Métodos de pago'}
    ];

    const [activeStep, setActiveStep] = useState(0);

    const [stepData,setStepData] = useState({
        datos:null,
        envio:null,
        pagos:null
    });

    const handleNext = () => {
        const tmpStep = activeStep +1;
        if(tmpStep === 1 ){
            if(stepData.datos){
                setEditUd(false);
                setEditShip(false);
            }
        }else if(tmpStep === 2 ){
            if(stepData.envio){
                setEditUd(false);
                setEditShip(false);  
            }
        }else{
        }
        setActiveStep(tmpStep);
    };

    const handleBack = () => {
        const tmpStep = activeStep -1;
        setActiveStep(tmpStep);

        if(tmpStep === 0){
        }else if(tmpStep === 1){
        }else if(tmpStep === 2){
            setEditUd(false);
            setEditShip(false);
        }else{
            setEditUd(false);
            setEditShip(false);
        }

    };

    const editForms = (item) =>{
        if(item === 1){
            setEditShip(false);
            setEditUd(true);
            setActiveStep(1);
        }else{
            setEditUd(false);
            setEditShip(true);
            setActiveStep(2);
        }
    }

    useEffect(()=>{
        if(token){
            setStepData({...stepData,datos:token.user})
        }
    },[token])
    
    return (
        <LayoutPages classComp={'checkoutPageCont'}>
            <LayoutCont keyPage={'CheckoutPage'}>
                <section className="secBox checkoutPageBox">
                    <Container>
                        
                        <BreadcrumbComp data={breadCrumb} />

                        <div className="inlineFlex checkoutPage">
                            <div className="titleSections">
                                <h1>Tu compra</h1>
                            </div>
                            <div className="checkoPapper checoStepper">
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {steps.map((step, index) => (
                                        <Step key={step.label}>
                                            <StepLabel
                                                StepIconComponent={ColorlibStepIcon}
                                            >
                                                <span>{step.label}</span>

                                                {  index === 1 && stepData.datos && !editUd  &&
                                                    <div 
                                                        className="inlineFlex checoStepperBox checoStepperBoxInfo"
                                                    >
                                                        <ul>
                                                            <li>Nombres: <strong>{stepData.datos.first_name}</strong></li>
                                                            <li>Apellidos: <strong>{stepData.datos.last_name}</strong></li>
                                                            <li>Correo: <strong>{stepData.datos.email}</strong></li>
                                                            <li>Telefono: <strong>{stepData.datos.acf.billing_phone}</strong></li>
                                                            <li>DNI: <strong>{stepData.datos.acf.wc_user_dni}</strong></li>
                                                        </ul>
                                                        <div className="btnFormEditar" onClick={()=>editForms(1)} >
                                                            <EditIcon />Editar
                                                        </div>

                                                        {activeStep === 1 && !editUd &&
                                                            <div className="inlineFlex checoStepperBtn">
                                                                <div 
                                                                    className="btnPrimary"
                                                                    onClick={handleNext}
                                                                >
                                                                    Siguiente
                                                                </div>
                                                                <div 
                                                                    className="btnPrimary"
                                                                    onClick={handleBack}
                                                                >
                                                                    
                                                                    Volver
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>
                                                }

                                                {  index === 2 && stepData.envio && !editShip &&
                                                    <div className="inlineFlex checoStepperBox checoStepperBoxInfo">
                                                        {stepData && stepData.envio && stepData.envio.type === 0 ?
                                                            <p>Envio a domicilio</p>
                                                        :
                                                            <div className="inlineBlock">
                                                                <p>Recojo en tienda <strong><a target={'_blank'} href="https://maps.app.goo.gl/cBfK9tw76NbHJNmSA" className={'linkGeneral'}>Av. Chillon Nro. 236 Z.I. Ex Fundo Chacra Cerro, Comas - Lima</a></strong></p>
                                                                <br />
                                                                <Alert  className={'alertInfo'} severity="info">
                                                                    Horario de atención: <br />
                                                                    Lunes a Jueves: 9:00 am- 6:00 pm <br />
                                                                    Viernes: 9:00 am - 1:00 pm
                                                                </Alert>
                                                            </div>
                                                        }

                                                        {stepData.envio.data && stepData.envio.data && stepData.envio.data.cprovincia === 'Lima' ?
                                                            <ul>
                                                                <li onClick={()=>console.log(stepData.envio.data)}>Ciudad: <strong>{stepData.envio.data.cciudad}</strong></li>
                                                                <li>Provincia: <strong>{stepData.envio.data.cprovincia}</strong></li>
                                                                <li>Distrito: <strong>{stepData.envio.data.cdistrito}</strong></li>
                                                                <li>Direccion: <strong>{stepData.envio.data.csaddess} - {stepData.envio.data.csaddessnum}</strong></li>
                                                                <li>Referencia: <strong>{stepData.envio.data.csref}</strong></li>
                                                                <li>Quien recibe: <strong>{stepData.envio.data.csrecib}</strong></li>
                                                                { stepData.envio.data.csrecib === 'otro' &&
                                                                    <div className="inlineBlock">
                                                                        <li>Destinatario: <strong>{stepData.envio.data.csrecibnom}</strong></li>
                                                                    </div>
                                                                }
                                                            </ul>
                                                        :stepData.envio.data && stepData.envio.data && stepData.envio.data.cprovincia !== 'Lima' &&
                                                            <ul>
                                                                <li >Ciudad: <strong>{stepData.envio.data.cciudad}</strong></li>
                                                                <li>Provincia: <strong>{stepData.envio.data.cprovincia}</strong></li>
                                                                <li>Distrito: <strong>{stepData.envio.data.cdistrito}</strong></li>
                                                                <li>Quien recibe: <strong>{stepData.envio.data.csrecib2}</strong></li>
                                                                { stepData.envio.data.csrecib2 === 'otro' &&
                                                                    <div className="inlineBlock">
                                                                        <li>Destinatario: <strong>{stepData.envio.data.csdestinatario}</strong></li>
                                                                        <li>Documento otro: <strong>{stepData.envio.data.csotrodoc}</strong></li>
                                                                        <li>Telefono: <strong>{stepData.envio.data.csotrotelefono}</strong></li>
                                                                    </div>
                                                                }
                                                            </ul>
                                                        }
                                                        <div className="btnFormEditar" onClick={()=>editForms(2)} >
                                                            <EditIcon />Editar
                                                        </div>


                                                        {activeStep === 2 && !editShip &&
                                                            <div className="inlineFlex checoStepperBtn">
                                                                <div 
                                                                    className="btnPrimary"
                                                                    onClick={handleNext}
                                                                >
                                                                    Siguiente
                                                                </div>
                                                                <div 
                                                                    className="btnPrimary"
                                                                    onClick={handleBack}
                                                                >
                                                                    
                                                                    Volver
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                                
                                                {  index === 3 && stepData.pagos &&
                                                    <div className="inlineFlex checoStepperBox">
                                                        
                                                    </div>
                                                }

                                            </StepLabel>
                                            <StepContent>
                                                {activeStep === 0 ?
                                                    <div className="inlineFlex checoStepperBox">
                                                        <div className="inlineFlex checoStepperResp">
                                                            
                                                            {cartItems && cartItems.length && cartItems.length > 0 ?
                                                                <div className="inlineFlex checoCartList">
                                                                    {cartItems.map((item)=>(
                                                                        <ProductInCart product={item} />
                                                                    ))}
                                                                </div>
                                                            :
                                                                <div className="inlineFlex checoCartList">
                                                                    <div className="inlineFlex empty">
                                                                        <PriorityHighRoundedIcon/> 
                                                                        <p>No tienes ningún artículo en tu carrito.</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className="inlineFlex checoStepperBtn">
                                                                <button
                                                                    onClick={handleNext}
                                                                    className={'btnPrimary'}
                                                                >
                                                                    {index === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :activeStep ===1 ?
                                                    <CheckoutFormUser 
                                                        nextForm={handleNext} 
                                                        backForm={handleBack} 
                                                        stepData={stepData} 
                                                        setStepData={setStepData} 
                                                        editUd={editUd}
                                                        setEditUd={setEditUd}
                                                    />
                                                :activeStep ===2 ?
                                                    <div className="inlineFlex">
                                                        {!stepData.envio ?
                                                            <CheckoutFormShipping 
                                                                nextForm={handleNext} 
                                                                backForm={handleBack} 
                                                                stepData={stepData} 
                                                                setStepData={setStepData}
                                                                setEditShip={setEditShip}
                                                                shippingData={shippingData}
                                                                setShippingData={setShippingData}
                                                            />
                                                        :
                                                            <div className="inlineBlock">
                                                                {editShip &&
                                                                    <CheckoutFormShippingEdit
                                                                        nextForm={handleNext} 
                                                                        backForm={handleBack} 
                                                                        stepData={stepData} 
                                                                        setStepData={setStepData} 
                                                                        editShip={editShip}
                                                                        setEditShip={setEditShip}
                                                                        setShippingData={setShippingData}
                                                                    />
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                :
                                                    <div className="inlineFlex checoStepperBox">
                                                        <div className="inlineFlex checoStepperResp">
                                                            <CheckoutFormPayment nextForm={handleNext} backForm={handleBack} shippingData={shippingData} />
                                                        </div>
                                                    </div>
                                                }
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>

                            <Sticky 
                                boundaryElement=".checkoutPage" 
                                topOffset={-130} 
                                hideOnBoundaryHit={false} 
                                className={' checoResumen'}  
                                stickyClassName={'checoResumenAct'}
                            >
                                <div className="inlineBlock checkoPapper checoResumenBox">
                                    <h3> <PointOfSaleIcon /> Resumen</h3>
                                    <ul className={'checoResTotal'}>
                                        <li>
                                            <p>Subtotal:</p>
                                            <strong>S/ {totalPayment.toFixed(2)}</strong>
                                        </li>
                                        <li>
                                            <p>IGV:</p>
                                            <strong>S/ 0.00</strong>
                                        </li>
                                        <li>
                                            <p>Delivery:</p>
                                            <strong>S/ {totals ? totals.delivery.toFixed(2) : '0'}</strong>
                                        </li>
                                        <li onClick={()=>console.log(',,,',totals)}>
                                            <p><strong>Total:</strong></p>
                                            <strong>S/ {totals ? totals.total.toFixed(2) : '0' }</strong>
                                        </li>
                                    </ul>
                                    
                                    <div className="inlineFlex checoTerms">
                                        <Alert className={'alertInfo'} severity="info">
                                            <strong>Importante:</strong> Su pedido será entregado en un
                                            plazo de 3 a 5 días hábiles si se encuentra en
                                            provincias, y de 1 a 2 días hábiles si está en Lima o
                                            Callao. Nos pondremos en contacto con usted 
                                        </Alert>
                                        {cartItems && cartItems.length && cartItems.length > 0 ?
                                            <ul className={'inlineFlex checoProdList'}>
                                                {cartItems.map((item)=>(
                                                    <li className={'inlineFlex'}>
                                                        <figure>
                                                            {item.images && item.images.length && item.images.length > 0 ?
                                                                <img src={item.images[0].src} alt="" />
                                                            :
                                                                <img src={prodNotfoundImg} alt="" />
                                                            }
                                                        </figure>
                                                        <div className="txt">
                                                            <h4>{item.name}</h4>
                                                            {item.aditionals &&
                                                                <p><small>Hojas: <strong>{item.aditionals.pages}</strong></small></p>
                                                            }
                                                            <p>Precio: S/ {item.price}</p>
                                                            <small>Cantidad: {item.amount}</small>
                                                        </div>
                                                    </li> 
                                                ))}
                                            </ul>
                                            :
                                            <Alert className={'alertInfo alertInfoBig'} severity="warning">No tienes ningún artículo en tu carrito.</Alert>
                                        }
                                        <div onClick={()=>setActiveStep(0)} className="btnBackCart">
                                            Volver al carrito
                                        </div>
                                    </div>
                                </div>
                            </Sticky>
                        </div>
                    </Container>
                </section>
            </LayoutCont>
        </LayoutPages>
    )
};

export default CheckoutPage;
