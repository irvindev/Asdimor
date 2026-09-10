import HeaderPage from './../global/header/header';
import FooterPage from './../global/footer/footer';
import ChatBoot from './../global/ChatBoot/ChatBoot';
import { useAuthContext } from './../../context/authContext';
import SplashAnim from './../util/splashAnim/splashAnim';

const LayoutPages = ({children,classComp}) => {
  
  const { loadGeneral } = useAuthContext();

  return (
    
    <main>
        <SplashAnim load={loadGeneral} />
        <HeaderPage />
            <div className={'inlineBlock pageContent '+classComp}>
              {children}
            </div>
        <FooterPage />
        <ChatBoot />
    </main>
  )
};

export default LayoutPages;
