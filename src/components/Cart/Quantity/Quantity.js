import React from "react";
import './Quantity.scss';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuthContext } from './../../../context/authContext';

const CartQuantity = ({quantity,product}) => {
    const {addItemToCart,deleteItemToCart} = useAuthContext();
    return (
        <div className="inlineFlex cartQuantityComp">
            <div className="minus" onClick={()=> deleteItemToCart(product)} >
                <RemoveIcon />
            </div>
            <span>{quantity}</span>
            <div className="plus" onClick={()=> addItemToCart(product)} >
                <AddIcon />
            </div>
        </div>
    )
};

export default CartQuantity;
