import { useState, useEffect } from "react";
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import Container from '@mui/material/Container';

import './mi-cuenta.scss';
import { useAuthContext } from './../../context/authContext';

import axios from 'axios';
import Modal from '@mui/material/Modal';
import 'moment/locale/es';
import Grid from '@mui/material/Grid';

import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import MiCuentaEdit from './mi-cuenta-edit';
import MiCuentaChangePass from './mi-cuenta-password';

const MyAccount = (props) => {

  const { token } = useAuthContext();
  const [formSwitch,setFormSwitch] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const [dataAcc,setDataAcc] = useState();

  const changeData = () =>{
    setFormSwitch(false);
    handleOpen();
  }

  const changePass = () =>{
    setFormSwitch(true);
    handleOpen();
  }

  useEffect(()=>{
      if(token){
          setDataAcc(token.user)
      }
  },[token])

  return (

    <LayoutPages classComp={'accountPageCont'}>
        <LayoutCont keyPage={'accountPage'}>
          <Container>
            <section className="secBox accountCont">
              <div className="titleSections">
                <h1>Mi cuenta </h1>
              </div>
              <Grid container spacing={2}>
                <Grid 
                  item 
                  size={{ xs: 12, sm: 12, md: 12, }}
                >
                  {dataAcc  &&
                    <div className="accountBox accountBoxDates">
                      <div className="inlineFlex title">
                        <h3>
                          <PermContactCalendarIcon /> 
                          Datos personales 
                        </h3>
                        <div className="btnFormEditar" onClick={changeData}>
                          <EditIcon/> Cambiar datos
                        </div>
                      </div>
                      <ul>
                        <li>
                          <p>
                            <strong>Nombre:</strong> {dataAcc.first_name  ? dataAcc.first_name :'------'}
                          </p>
                        </li>
                        <li>
                          <p>
                            <strong>Apellidos:</strong> {dataAcc.last_name  ? dataAcc.last_name :'------'}
                          </p>
                        </li>
                        <li>
                          <p>
                            <strong>Correo:</strong> {dataAcc.email  ? dataAcc.email :'------'}
                          </p>
                        </li>
                        {dataAcc.acf && dataAcc.acf.billing_phone &&
                          <li>
                            <p>
                              <strong>Teléfono:</strong> {dataAcc.acf.billing_phone}
                            </p>
                          </li>
                        }
                        {dataAcc.acf && dataAcc.acf.wc_user_dni &&
                          <li>
                            <p>
                              <strong>DNI:</strong> {dataAcc.acf.wc_user_dni}
                            </p>
                          </li>
                        }
                        <li>
                          <p>
                            <strong>Contraseña:</strong> {'*********'} 
                          </p>
                          <div className="btnFormEditar" onClick={changePass}>
                            <VpnKeyIcon /> Cambiar contraseña
                          </div>
                        </li>
                      </ul>
                    </div>
                  }
                </Grid>

              </Grid>
            </section>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className="accountModalBox">
                {!formSwitch ?
                  <div className="inlineBlock">
                    <div className="titleSections">
                      <h1>Datos personales</h1>
                    </div>
                    <MiCuentaEdit handleClose={handleClose} />
                  </div>
                :
                  <div className="inlineBlock">
                    <div className="titleSections">
                      <h1>Cambiar contraseña</h1>
                    </div>
                    <MiCuentaChangePass handleClose={handleClose} />
                  </div>
                }
              </div>
            </Modal>


          </Container>
        </LayoutCont>
    </LayoutPages>
  )
};

export default MyAccount;
