
import Grid from '@mui/material/Grid';

import { 
        initMercadoPago, 
        CardNumber, 
        SecurityCode, 
        ExpirationDate, 
        createCardToken,
        getPaymentMethods
    } from '@mercadopago/sdk-react';

import TextField from '@mui/material/TextField';

import './card.scss';
import { useState, useEffect } from 'react';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useAuthContext } from './../../../context/authContext';

import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import RespMpModal from './respuesta';

const CheckoutCardForm = ({backForm, shippingData}) => {

    initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY);
    let navigate = useNavigate();
    const [respPayment,setRespPayment] = useState();
    const { cartItems, baseUrl, keysWc, deliveryDep, totals, token, emptyCart } = useAuthContext();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if(respPayment === 'approved'){
            navigate('/mi-cuenta/ordenes')
        }
        setOpen(false)
    };

    const [loadForm,setLoadForm] = useState(0);

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


    const cardToken = async (data) => {
        setLoadForm(1);
        const response = await createCardToken({
            cardholderName: data.mpnombres,
            identificationType: 'DNI',
            identificationNumber: data.mpdni,
        })

        const paymentMethods = await getPaymentMethods({ bin: response.first_six_digits });

        if(paymentMethods && paymentMethods.results.length){

            axios.post(process.env.REACT_APP_MP_PAYMENT_URL,
                    {
                        token: response.id,
                        payment_method_id: paymentMethods.results[0].id,
                        transaction_amount: totals ? String(totals.total) : 2,
                        payer: { 
                            email: token.user.email
                        }
                    }
                )
                .then((resp)=>{
                    
                    sendOrder();
                    setLoadForm(false);
                    setRespPayment(resp.data.status);
                    emptyCart();
                    handleOpen();
                    setLoadForm(2);
                }).catch((error)=>{
                    setLoadForm(0);
                })
        }
    }

    const [fieldBody,setFieldBody] = useState({});
    
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
        mpnombres: Yup.string().min(3, "Deben tener al menos ocho caracteres.").required(),
        mpdni: Yup.string().min(8, "Deben tener al menos ocho caracteres.").max(8).required()
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


    const onSubmit = (data) => {
        
        cardToken(data);
    }

    useEffect(()=>{
        getUserInfo();
    },[]);

    return (
        <form className={'inlineBlock pTarjetasForm'} onSubmit={handleSubmit(onSubmit)}>
            <Grid container fullWidth spacing={2}>
                <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 7, }}>
                    <TextField 
                        label="Nombres completos" 
                        name="mpnombres"
                        fullWidth
                        id="mpnombres"
                        variant="filled"
                        onChange={changeField}
                        {...register("mpnombres")}
                    />
                </Grid>
                <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 5, }}>
                    <TextField 
                        label="DNI:" 
                        name="mpdni"
                        fullWidth
                        id="mpdni"
                        variant="filled"
                        onChange={changeField}
                        {...register("mpdni")}
                    />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 6, }}>
                    <CardNumber placeholder="Numero de tarjeta" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 3, }}>
                    <SecurityCode placeholder="Codigo de seguridad" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 3, }}>
                    <ExpirationDate placeholder="Expiration date" />
                </Grid>

                {loadForm === 0 ? 
                    <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                        <div className="inlineFlex btnBox">
                            <button 
                                className={'inlineBlock btnPrimary'}
                                type="submit"
                            >
                                Pagar
                            </button>

                            <div 
                                className={'inlineBlock btnPrimary'}
                                onClick={backForm}
                            >
                                Volver
                            </div>
                        </div>
                    </Grid>
                : loadForm === 1?
                    <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                        <div className={'inlineBlock btnPrimary'} >
                            <span>Estamos procesando el pago. </span>
                            <CircularProgress color={'white'} size="20px" />
                        </div>
                    </Grid>
                : loadForm === 2 &&
                    <Grid item size={{ xs: 12, sm: 12, md: 12, }}>
                        <div className={'inlineBlock btnPrimary'} >
                            <span>Estamos generando la orden.</span>
                            <CircularProgress color={'white'} size="20px" />
                        </div>
                    </Grid>
                }

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

export default CheckoutCardForm;
