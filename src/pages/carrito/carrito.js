import React from "react"
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import BreadcrumbComp from './../../components/global/breadcrumb/breadcrumb';
import Container from '@mui/material/Container';

import './carrito.scss';
import { useAuthContext } from './../../context/authContext';
import ProductInCart from './../../components/Cart/ProductInCart/ProductInCart';

import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { Link } from 'react-router';


const CartPage = (props) => {

    const breadCrumb = [
            {
                name:'Inicio',
                link:'/'
            },
            {
                name:'Carrito',
            },
    ]

    const {cartItems} = useAuthContext();

    const totalPayment = cartItems.reduce(
        (previous,current) => {
            const totalTemp = (previous + parseFloat(current.price)) * current.amount ;
            return totalTemp;
    },0);

    return (
        <LayoutPages classComp={'cartPageCont'}>
            <LayoutCont keyPage={'CartPage'}>
                <section className="secBox cartPageBox">
                    <Container>
                        <BreadcrumbComp data={breadCrumb} />

                        <div className="inlineFlex cartPage">
                            <div className="titleSections">
                                <h1>Carrito</h1>
                            </div>
                            <div className="inlineFlex cartPageSummary">
                                {cartItems && cartItems.length && cartItems.length > 0 ?
                                    <div className="cpsList">
                                        {cartItems.map((item)=>(
                                            <ProductInCart product={item} />
                                        ))}
                                    </div>
                                :
                                    <div className="cpsList">
                                        <div className="empty">
                                            <PriorityHighRoundedIcon/> 
                                            <p>No tienes ningún artículo en tu carrito.</p>
                                        </div>
                                    </div>
                                }
                                <div className="cpsTotalBox">
                                    <h3>Resumen</h3>
                                    <ul>
                                        <li>
                                            <p>Subtotal</p>
                                            <strong>{totalPayment.toFixed(2)}</strong>
                                        </li>
                                        <li>
                                            <p>IGV</p>
                                            <strong>S/. 0</strong>
                                        </li>
                                        <li>
                                            <p>Delivery</p>
                                            <strong>{totalPayment.toFixed(2)}</strong>
                                        </li>
                                    </ul>
                                    
                                    <Link to={'/checkout'} className="btnPrimary">
                                        Pagar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Container>

                </section>
            </LayoutCont>
        </LayoutPages>
    )
};

export default CartPage;
