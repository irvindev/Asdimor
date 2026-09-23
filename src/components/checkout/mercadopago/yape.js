import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import { useAuthContext } from './../../../context/authContext';

import paymentYape4 from '../../../assets/img/payment_yape_4.png';
import paymentYape5 from '../../../assets/img/payment_yape_5.png';
import paymentYape6 from '../../../assets/img/payment_yape_6.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router";

import axios from 'axios';

import './yape.scss'
import RespMpModal from './respuesta';

import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

const CheckoutYapeForm = ({backForm,shippingData}) => {

    const [fieldBody,setFieldBody] = useState({});
    const [loadForm,setLoadForm] = useState(0);
    let navigate = useNavigate();
    const [respPayment,setRespPayment] = useState();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if(respPayment === 'approved'){
            navigate('/mi-cuenta/ordenes')
        }
        setOpen(false)
    };

    const { cartItems, baseUrl, keysWc, deliveryDep, token, totals, emptyCart } = useAuthContext();

    const changeField = (e) =>{
        if( e.target.type === 'checkbox'){
            setFieldBody({
                ...fieldBody,
                [e.target.name]: e.target.checked
            })
        }else{
            setFieldBody({
                ...fieldBody,
                [e.target.name]: e.target.value
            })
        }
    }

    const validationSchema = Yup.object().shape({
        cnumber: Yup.string().min(9, "Deben tener al menos ocho caracteres.").max(9).required(),
        csecurity: Yup.string().min(6, "Deben tener al menos ocho caracteres.").max(6).required()
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "all",
        shouldUnregister: false,
        resolver: yupResolver(validationSchema),
    });

    const [errorList,setErrorList] = useState();

    const [ userInfo, setUserInfo ] = useState();
    const getUserInfo = ()=>{
        setUserInfo({
            info: token.user,
            shipping: shippingData
        });
    }

    const sendOrder = () => {
        const cartTmp = [];
        let deliveryTmp = 0;
        
        if(cartItems.length && cartItems.length > 0){
            cartItems.map((item)=>{

                if(item.aditionals){
                    cartTmp.push(
                        {
                            product_id: item.id,
                            quantity: item.amount,
                            meta_data: [
                                {
                                    key: "portada",
                                    value: item.aditionals.portada ? item.aditionals.portada : item.images[0].src
                                },
                                {
                                    key:"hojas",
                                    value:item.aditionals.pages
                                }
                            ],
                            subtotal: item.price,
                            total: item.price
                        }
                    )
                }else{
                    cartTmp.push(
                        {
                            product_id: item.id,
                            quantity: item.amount,
                            subtotal: item.price,
                            total: item.price
                        }
                    )
                }
            })
        }

        if(deliveryDep === 'Lima' || deliveryDep === 'Callao'){
            deliveryTmp = 15;
        }else{
            deliveryTmp = 0
        }

        const shipping = userInfo?.shipping ?? {};

        const addressParts = [
            shipping.csaddess,
            shipping.csaddessnum,
            shipping.csdpto
        ].filter(Boolean); // elimina null, undefined o ""

        const fullAddress = addressParts.length > 0
            ? addressParts.join(" - ")
        : "";

        axios.post(baseUrl+'wp-json/wc/v3/orders?consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs,
            {
                customer_id: token.user.id,
                billing: {
                    first_name: userInfo.info.first_name,
                    last_name: userInfo.info.last_name,
                    email: userInfo.info.email,
                    phone: userInfo.info.acf.billing_phone,
                    address_1: fullAddress,
                    address_2: shipping.csref ?? "",
                    city: userInfo?.shipping?.cciudad ?? "",
                    country: 'PE',

                },
                shipping: {
                    first_name: userInfo.info.first_name,
                    last_name: userInfo.info.last_name,
                    address_1: fullAddress,
                    address_2: shipping.csref ?? "",
                    city: userInfo?.shipping?.cciudad ?? "",
                    country: 'PE',
                },
                status:'completed',
                meta_data: [
                    {
                        key: "_shipping_avenida",
                        value: userInfo?.shipping?.csaddess ?? "",
                    },
                    {
                        key: "_shipping_n_dir",
                        value: userInfo?.shipping?.csaddessnum ?? "",
                    },
                    {
                        key: "_shipping_piso",
                        value: userInfo?.shipping?.csdpto ?? "",
                    },
                    {
                        key: "_shipping_referencia",
                        value: userInfo?.shipping?.csref ?? "",
                    },
                    {
                        key: "_shipping_cciudad",
                        value: userInfo?.shipping?.cciudad ?? "",
                    },
                    {
                        key: "_shipping_cprovincia",
                        value: userInfo?.shipping?.cprovincia ?? "",
                    },
                    {
                        key: "_shipping_cdistrito",
                        value: userInfo?.shipping?.cdistrito ?? "",
                    },
                    {
                        key: "_shipping_csrecib",
                        value: userInfo?.shipping?.csrecib ?? "",
                    },
                    {
                        key: "_shipping_csrecibnom",
                        value: userInfo?.shipping?.csrecibnom ?? "",
                    },
                    {
                        key: "_shipping_csrecib2",
                        value: userInfo?.shipping?.csrecib2 ?? "",
                    },
                    {
                        key: "_shipping_csdestinatario",
                        value: userInfo?.shipping?.csdestinatario ?? "",
                    },
                    {
                        key: "_shipping_csotrotelefono",
                        value: userInfo?.shipping?.csotrotelefono ?? "",
                    },
                    {
                        key: "_shipping_csotrodoc",
                        value: userInfo?.shipping?.csotrodoc ?? "",
                    },
                ],
                line_items: cartTmp,
                shipping_lines: [
                {
                    method_id: "flat_rate",
                    method_title: "Flat Rate",
                    total: totals ? String(totals.delivery) : '0'
                }
                ],
                payment_method: "Yape",
                payment_method_title: "Yape",
                set_paid: true
            }
        ).then((resp)=>{
            //console.log('88888==>',resp);
            //handleOpen();
            //emptyCart();
            //setRespPayment(resp.status);
            //handleOpen();
            //setLoadForm(0);

        }).catch((err)=>{
            console.log(err);
            setLoadForm(0);
        })
    }


    const onSubmit = (data) => {
        setLoadForm(1);
        
        const baseUrlTmp = 'https://api.mercadopago.com/platforms/pci/yape/v1/payment?public_key='+process.env.REACT_APP_MP_PUBLIC_KEY;
        axios.post(baseUrlTmp,{
                phoneNumber: data.cnumber,
                otp: data.csecurity
            }).then((resp)=>{
                axios.post(process.env.REACT_APP_MP_PAYMENT_URL,
                        {
                            token: resp.data.id,
                            transaction_amount: totals ? totals.total : 2,
                            description: "Consumo Asdimor ",
                            payment_method_id: "yape",
                            payer: { email: token.user.email }
                        }
                    )
                    .then((resp)=>{
                        sendOrder();
                        setLoadForm(false);
                        console.log('respuesta de pago yapeeee', resp.data )
                        setRespPayment(resp.data.status);
                        emptyCart();
                        handleOpen();
                        setLoadForm(2);
                    }).catch((error)=>{
                        console.log('no',error)
                        setLoadForm(false);
                    })
            }).catch((errr)=>{
                console.log(errr)
            })
    }
    

    useEffect(()=>{
        getUserInfo();
    },[])

    return (
        <form className={'inlineBlock'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container fullWidth spacing={2}>
    
                <Grid item size={{ xs: 12, sm: 12, md: 8 }}>
                
                    <Grid container fullWidth spacing={2}>

                        <Grid className={errors.cnumber ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
                            <TextField 
                                label="Numero" 
                                name="cnumber"
                                fullWidth
                                id="cnumber"
                                variant="filled"
                                onChange={changeField}
                                {...register("cnumber")}
                            />
                        </Grid>

                        <Grid className={errors.csecurity ? 'textField textFieldWhite textFieldError' : 'textField textFieldWhite' } item size={{ xs: 12, sm: 12, md: 12, }}>
                            <TextField 
                                label="Codigo de seguridad" 
                                name="csecurity"
                                fullWidth
                                id="csecurity"
                                variant="filled"
                                onChange={changeField}
                                {...register("csecurity")}
                            />
                        </Grid>

                        {errorList &&
                            <Grid className={'textFielCheck'} item size={{ xs: 12, sm: 12, md: 12 }}>
                                <Alert severity="error" >{errorList ? errorList.response.data.message : '' }</Alert>
                            </Grid>
                        }

                        <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                            <div className="inlineFlex checoStepperBtn">

                                {loadForm === 0 ?
                                   <button className={'btnPrimary'} >
                                        <div className={'text'}>Pagar</div> 
                                        
                                    </button>
                                : loadForm === 1?
                                   <div className={'btnPrimary btnPrimaryDisabled'} >
                                        <span>Estamos procesando el pago</span> 
                                        <CircularProgress color={'white'} size="20px" />
                                    </div>
                                : loadForm === 2 &&
                                   <div className={'btnPrimary btnPrimaryDisabled'} >
                                        <span>Estamos generando la orden</span> 
                                        <CircularProgress color={'white'} size="20px" />
                                    </div>
                                }
                                <div 
                                    onClick={backForm} 
                                    className={'btnPrimary btnPrimaryBack'}
                                >
                                    <div className={'text'}>Volver</div>
                                </div>

                            </div>
                        </Grid>

                    </Grid>

                </Grid>
            
                <Grid item size={{ xs: 12, sm: 12, md: 4 }}>
                    <div className="inlineFlex yapeSwiperBox">
                        <Swiper 
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            }}
                            pagination={{
                            clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="yapeSwiper"
                        >
                            <SwiperSlide><img src={paymentYape4} alt="" /></SwiperSlide>
                            <SwiperSlide><img src={paymentYape5} alt="" /></SwiperSlide>
                            <SwiperSlide><img src={paymentYape6} alt="" /></SwiperSlide>
                        </Swiper>
                    </div>
                </Grid>

            </Grid>

            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                
                <RespMpModal respPayment={respPayment} closModal={handleClose} />
            </Modal>
        </form>
    )
};

export default CheckoutYapeForm;
