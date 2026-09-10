import './ProductInCart.scss';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import prodNotfoundImg from '../../../assets/img/prod_not_found.png';
import CartQuantity from './../Quantity/Quantity';
import { useAuthContext } from './../../../context/authContext';

const ProductInCart = ({product}) => {

    const { removeItemToList } = useAuthContext();

    return (
        <div className="inlineFlex cmProduct">
            <figure>
                {product.images && product.images.length && product.images.length > 0 ?
                    <img src={product.images[0].src} alt="" />
                :
                    <img src={prodNotfoundImg} alt="" />
                }
            </figure>
            <div className="txt">
                <p>{product.name}</p>
                {product.aditionals &&
                    <p><small>Hojas: <strong>{product.aditionals.pages}</strong></small></p>
                }
                <p><strong>S/ {product.price}</strong></p>
                <CartQuantity quantity={product.amount} product={product} />
            </div>
            <div className="remove" onClick={()=>removeItemToList(product)}>
                <DeleteOutlinedIcon />
            </div>
        </div>
    )
};

export default ProductInCart;
