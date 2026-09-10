
import logo from '../../../assets/img/logo_asdimor.png';
import logo1 from '../../../assets/img/anim_logo1.png';
import logo2 from '../../../assets/img/anim_logo2.png';
import logo3 from '../../../assets/img/anim_logo3.png';
import logo4 from '../../../assets/img/anim_logo4.png';
import logo5 from '../../../assets/img/anim_logo5.png';

import LinearProgress from '@mui/material/LinearProgress';

import './splashAnim.scss';

const SplashAnim = ({load}) => {
  return (

    <div
      className={
        load < 10 ? 'splashAnim'
        : load < 100 ? 'splashAnim splashAnimLogo'
        : 'splashAnim splashAnimLogo splashAnimFinal splashAnimAct'
      }
    >
        <div className="splshLogo">
          <figure>
              <img className={'back'} src={logo} alt="" />
              <img className={'anim anim1'} src={logo1} alt="" />
              <img className={'anim anim2'} src={logo2} alt="" />
              <img className={'anim anim3'} src={logo3} alt="" />
              <img className={'anim anim4'} src={logo4} alt="" />
              <img className={'anim anim5'} src={logo5} alt="" />
          </figure>
          <LinearProgress 
            className={'splashLoad'} 
            value={load}
            variant={'determinate'}
          />
        </div>

    </div>
  )
};

export default SplashAnim;
