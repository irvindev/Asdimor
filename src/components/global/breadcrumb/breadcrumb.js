
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import './breadcrumb.scss'
import { Link } from 'react-router';

const BreadcrumbComp = ({data}) => {
  return (
    <div className="breadCrumbComp">
        <Breadcrumbs aria-label="breadcrumb">
          {data && data.length && data.map((item)=>{
            if(item.link){
              return (
                <Link color="inherit" to={item.link}>
                  {item.name}
                </Link>
              )
            }else{
              return (
                <Typography sx={{ color: 'text.primary' }}>{item.name}</Typography>
              )
            }
          })}

          
        </Breadcrumbs>
    </div>
  )
};

export default BreadcrumbComp;
