
import './ProductItem.scss';

import Skeleton from '@mui/material/Skeleton';

const ProductItemLoad = ({data}) => {
  return (
    <div className="productItem">
        <h4>
          <Skeleton variant="text" sx={{ fontSize: '3rem' }} />
        </h4>
        <Skeleton variant="text" sx={{ fontSize: '1.75rem' }} />
        <figure>
          <Skeleton variant="rounded" width={'100%'} height={360} />
        </figure>
        
    </div>
  )
};

export default ProductItemLoad;
