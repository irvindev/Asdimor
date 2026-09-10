import { useState,useEffect } from "react";
import { Link } from "react-router";
import './header.scss'
import Container from '@mui/material/Container';
import logo from '../../../assets/img/logo_asdimor.png';

import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Badge from '@mui/material/Badge';

import icoLogin from '../../../assets/img/ico_login.png';
import CloseIcon from '@mui/icons-material/Close';
import CartMenu from './../CartMenu/CartMenu';
import { useAuthContext } from './../../../context/authContext';
import AnunciosTop from './../AnunciosTop/AnunciosTop';

import Modal from '@mui/material/Modal';
import HeaderLogin from './headerLogin';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { useNavigate } from "react-router";


const HeaderPage = (props) => {

    const [menu,setMenu] = useState(false);
    let navigate = useNavigate();

    const { cartItems, infoGeneral, token, handleLogout, loginOpen, setLoginOpen, cartMenuOpen, setCartMenuOpen } = useAuthContext();

    const openMenu = () =>{
        setMenu(true)
    }

    const closeMenu = () =>{
        setMenu(false)
    }

    const cartMenuOpenHandler = () =>{
        setCartMenuOpen(true)
    }
    const cartMenuCloseHandler = () =>{
        setCartMenuOpen(false)
    }

    const [dataConf,setDataConf] = useState();

    const getData = () =>{
        if(infoGeneral){
            setDataConf(infoGeneral.configuracionesFields);
        }
    }


    const handleOpen = () => setLoginOpen(true);
    const handleClose = () => setLoginOpen(false);

    const logOutHeader = () =>{
        handleLogout();
        navigate('/');
    }

    useEffect(()=>{
        getData();
        
    },[infoGeneral,token])

    return (
        <div className="menuCont">
            <div className="inlineFlex headerNotifications">
                <Container>
                    {dataConf && dataConf.confAnun &&
                        <AnunciosTop data={dataConf.confAnun}  />
                    }
                </Container>
            </div>
            <header>
                <Container>
                    <div className="inlineFlex headerBox">
                        <div className="menuRespHam" onClick={openMenu}>
                            <span className="line line1"></span>
                            <span className="line line2"></span>
                            <span className="line line3"></span>
                        </div>

                        <figure className={'headerLogo'}>
                            <Link to={'/'}>
                                <img src={logo} />
                            </Link>
                        </figure>

                        <div className="menuRespCart">
                            <div className="btnHeader btnHeaderCart" onClick={()=>setCartMenuOpen(true)}>
                                <Badge badgeContent={cartItems.length} color="primary">
                                    <LocalMallOutlinedIcon/>
                                </Badge>
                            </div>
                            <div className="btnHeader btnHeaderCart" onClick={handleOpen}>
                                <img src={icoLogin} alt="" />
                            </div>
                        </div>

                        <div className={menu ? 'inlineFlex menuList menuListAct' : 'inlineFlex menuList'}>

                            <div className="menuRespClose" onClick={closeMenu}>
                                <Link to={'/'}>
                                    <CloseIcon />
                                </Link>
                            </div>

                            <figure className={'respLogo'}>
                                <img src={logo} />
                            </figure>

                            {dataConf && dataConf.congMenu.length && dataConf.congMenu.length > 0 &&
                                <ul>
                                    {dataConf.congMenu.map((item)=>(
                                        <li>
                                            <Link to={item.confMenuLink}>
                                                {item.confMenuNombre}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            }

                            <div className="inlineFlex menuBtnBox">
                                {token ?
                                    <div to={'/mi-cuenta'} asdasd={token && 'sdd'} className="btnHeader btnLogin">
                                        <img src={icoLogin} /> <span>Mi cuenta</span>
                                        <div className="btnLoginSubmenu">
                                            <ul>
                                                <li>
                                                    <Link to={'/mi-cuenta'}>
                                                        <BorderColorIcon /> Editar datos
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={'/mi-cuenta/ordenes'}>
                                                        <ArticleIcon /> Mis compras
                                                    </Link>
                                                </li>
                                                <li>
                                                    <a href={'#'} onClick={()=>logOutHeader()}>
                                                        <LogoutIcon /> Cerrar sesión
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                :
                                    <div className="btnHeader btnLogin" onClick={handleOpen}>
                                        <img src={icoLogin} /> <span>Ingresar</span>
                                    </div>
                                }
                                <Link to={'/tienda'} className="btnHeader btnHeaderSearch">
                                    <SearchOutlinedIcon/>
                                </Link>
                                <div className="btnHeader btnHeaderCart" onClick={()=>setCartMenuOpen(true)}>
                                    <Badge badgeContent={cartItems.length} color="primary">
                                        <ShoppingCartOutlinedIcon/>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </header>

            <CartMenu />

            <Modal
                open={loginOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus
                disableEnforceFocus
                disableScrollLock
            >
                <div className="headerLoginBox">
                    <HeaderLogin handleClose={handleClose} />
                </div>
            </Modal>
        </div>
    )
};

export default HeaderPage;
