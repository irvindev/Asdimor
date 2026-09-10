import {useState,useEffect} from "react";
import LayoutPages from './../../components/LayoutPages/LayoutPages';
import LayoutCont from './../../components/LayoutCont/LayoutCont';
import Container from '@mui/material/Container';

import './ordenes.scss';
import { useAuthContext } from './../../context/authContext';

import Grid from '@mui/material/Grid';

import axios from 'axios';
import moment from 'moment';
import Modal from '@mui/material/Modal';
import 'moment/locale/es';

import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

const OrdenesPage = (props) => {

  moment.locale('es');
  const { baseUrl, token, keysWc } = useAuthContext();

  const [orderList,setOrderList] = useState();
  const getOrders = () =>{
    if(token){
    axios.get(baseUrl+'/wp-json/wc/v3/orders?customer='+token.user.id+'&consumer_key='+keysWc.ck+'&consumer_secret='+keysWc.cs)
      .then((resp)=>{
        setOrderList(resp.data);
        console.log(resp.data)
      }).catch((err)=>{
        console.log(err)
      })
    }
  }

  const [orderModal,setOrderModal] = useState();
  const [orderMeta,setOrderMeta] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    let orderMetaTmp = {};
    setOrderModal(item);
    if(item && item.meta_data && item.meta_data.length ){

      item.meta_data.map((item)=>{
        if(item.key === '_shipping_cciudad' && item.value !== ''){
          orderMetaTmp.cciudad = item.value;
        }
        if(item.key === '_shipping_cprovincia' && item.value !== ''){
          orderMetaTmp.cprovincia = item.value;
        }
        if(item.key === '_shipping_cdistrito' && item.value !== ''){
          orderMetaTmp.cdistrito = item.value;
        }
        if(item.key === '_shipping_avenida' && item.value !== ''){
          orderMetaTmp.avenida = item.value;
        }
        if(item.key === '_shipping_n_dir' && item.value !== ''){
          orderMetaTmp.n_dir = item.value;
        }
        if(item.key === '_shipping_piso' && item.value !== ''){
          orderMetaTmp.piso = item.value;
        }
        if(item.key === '_shipping_referencia' && item.value !== ''){
          orderMetaTmp.referencia = item.value;
        }
        if(item.key === '_shipping_csrecib' && item.value !== ''){
          orderMetaTmp.csrecib = item.value;
        }
        if(item.key === '_shipping_csrecibnom' && item.value !== ''){
          orderMetaTmp.csrecibnom = item.value;
        }
        if(item.key === '_shipping_csrecib2' && item.value !== ''){
          orderMetaTmp.csrecib2 = item.value;
        }
        if(item.key === '_shipping_csdestinatario' && item.value !== ''){
          orderMetaTmp.csdestinatario = item.value;
        }
        if(item.key === '_shipping_csotrotelefono' && item.value !== ''){
          orderMetaTmp.csotrotelefono = item.value;
        }
        if(item.key === '_shipping_csotrodoc' && item.value !== ''){
          orderMetaTmp.csotrodoc = item.value;
        }

        setOrderMeta(orderMetaTmp);
      })
    }else{
      setOrderMeta(false);
    }
  };

  const handleClose = () => setOpen(false);

    
  useEffect(()=>{
    if(token){
      getOrders();
    }
  },[token])

  return (
    <LayoutPages classComp={'ordenesPageCont'}>
      <LayoutCont keyPage={'ordenesPage'}>
        <Container>
          <section className="secBox ordenesCont">
            <div className="titleSections">
              <h1 onClick={()=>console.log(orderList)}>Mis ordenes</h1>
            </div>
            <div className="ordenesBox">
              
              {orderList && orderList.length  && orderList.length > 0 &&
                <div className="inlineFlex ordenesListBox">
                  {orderList.map((item) => (
                    <div className="inlineFlex ordenesListItem">
                      <div className="olTxt olHead">
                        <p>Order:</p>
                        <h5>{item.number}</h5>
                      </div>
                      <div className="olTxt olTotal">
                        <p>Total:</p>
                        <h5>S/. {item.total}</h5>
                      </div>
                      <div className="olTxt olEstado">
                        <p>Estado:</p>
                        <div className="status">Completa</div>
                      </div>
                      <div className="olTxt olFecha">
                        <p>Fecha</p>
                        <h5>{item.date_created && moment(item.date_created).format('LLL')}</h5>
                      </div>
                      <div className="olAction">
                        <div
                          className="btnTable" 
                          onClick={()=>handleOpen(item)}
                        >
                          Ver detalle
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </section>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="inlineBlock maModalBox">
              <div className="closedPopup" onClick={handleClose}>
                <CloseIcon/>
              </div>
              <div className="titleSections">
                <h3>Detalle</h3>
              </div>

              <Grid container spacing={2}>
                <Grid 
                    item 
                    size={{ xs: 12, sm: 12, md: 6, }}
                >
                  {orderModal && orderModal.billing &&
                    <div className="inlineFlex maModalPaperBox maModalBilling">
                      <h4>
                        <PermContactCalendarIcon /> Facturación:
                      </h4>
                      <ul className={'dataList'}>
                        <li>
                          Nombre: {orderModal.billing.first_name}
                        </li>
                        <li>
                          Apellidos: {orderModal.billing.last_name}
                        </li>
                        <li>
                          Correo: {orderModal.billing.email}
                        </li>
                        <li>
                          Teléfono:  {orderModal.billing.phone}
                        </li>
                        <li>
                          Fecha:  {moment(orderModal.date_created).format('LLL')}
                        </li>
                      </ul>
                    </div>
                  }
                  {orderModal && orderModal.shipping &&
                    <div className="inlineFlex maModalPaperBox">
                      
                      <h4 onClick={()=>console.log(orderMeta)}><LocalShippingIcon/> Envio:</h4>
                      <ul className={'dataList'}>

                        {orderMeta.cciudad === undefined &&
                          <div className="inlineBlock">
                              <p>Recojo en tienda <strong><a target={'_blank'} href="https://maps.app.goo.gl/cBfK9tw76NbHJNmSA" className={'linkGeneral'}>Av. Chillon Nro. 236 Z.I. Ex Fundo Chacra Cerro, Comas - Lima</a></strong></p>
                              <br />
                              <Alert  className={'alertInfo'} severity="info">
                                  Horario de atención: <br />
                                  Lunes a Jueves: 9:00 am- 6:00 pm <br />
                                  Viernes: 9:00 am - 1:00 pm
                              </Alert>
                          </div>
                        }


                        {orderMeta && orderMeta.cciudad && orderMeta.cciudad !== '' &&
                          <li>Ciudad: {orderMeta.cciudad}</li>
                        }
                        {orderMeta && orderMeta.cprovincia && orderMeta.cprovincia !== '' &&
                          <li>Provincia: {orderMeta.cprovincia}</li>
                        }
                        {orderMeta && orderMeta.cdistrito && orderMeta.cdistrito !== '' &&
                          <li>Distrito: {orderMeta.cdistrito}</li>
                        }
                        {orderMeta && orderMeta.avenida && orderMeta.avenida !== '' &&
                          <li>Avenida: {orderMeta.avenida} - {orderMeta.n_dir}</li>
                        }
                        {orderMeta && orderMeta.n_piso && orderMeta.n_piso !== '' &&
                          <li>Piso: {orderMeta.n_piso}</li>
                        }
                        {orderMeta && orderMeta.referencia && orderMeta.referencia !== '' &&
                          <li>Referencia: {orderMeta.referencia}</li>
                        }

                        {orderMeta && (orderMeta.csrecib || orderMeta.csrecib2) && (
                          <li>
                            ¿Quién recibirá?: {
                              (orderMeta.cprovincia === 'Lima' || orderMeta.cprovincia === 'Callao')
                                ? orderMeta.csrecib
                                : orderMeta.csrecib2
                            }
                          </li>
                        )}
                        {orderMeta && orderMeta.csrecibnom && orderMeta.csrecibnom !== '' &&
                          <li>Nombre: {orderMeta.csrecibnom}</li>
                        }

                        {orderMeta && orderMeta.csdestinatario && orderMeta.csdestinatario !== '' &&
                          <li>Destinatario: {orderMeta.csdestinatario}</li>
                        }
                        {orderMeta && orderMeta.csotrotelefono && orderMeta.csotrotelefono !== '' &&
                          <li>Teléfono: {orderMeta.csotrotelefono}</li>
                        }
                        {orderMeta && orderMeta.csotrodoc && orderMeta.csotrodoc !== '' &&
                          <li>DNI: {orderMeta.csotrodoc}</li>
                        }
                      </ul>
                    </div>
                  }
                </Grid>

                <Grid 
                    item 
                    size={{ xs: 12, sm: 12, md: 6, }}
                >
                  {orderModal && orderModal.line_items &&
                    <div className="inlineFlex maModalPaperBox ">
                      <h4 onClick={()=>console.log(orderModal.line_items)}> <ChecklistIcon/> Productos:</h4>
                      <ul className={'maModalProdList'}>
                        {orderModal.line_items && orderModal.line_items.length > 0 && orderModal.line_items.map((item)=>(
                        <li>
                          <figure>
                            {(() => {
                              const portada = item.meta_data?.find(
                                meta => meta.key === 'portada'
                              );

                              return (
                                <img
                                  src={portada?.value || item.image?.src}
                                  alt=""
                                />
                              );
                            })()}
                          </figure>
                          <div className="txt">
                            <h5 >{item.name}</h5>
                            <p>Precio: {item.price}</p>
                            <p>Cantidad: {item.quantity}</p>


                            {item.meta_data && item.meta_data.length > 0 && (
                              <p>
                                Hojas:{" "}
                                {item.meta_data
                                  .filter(sitem => sitem.key === "hojas")
                                  .map(sitem => sitem.value)}
                              </p>
                            )}
                          </div>
                        </li>
                        )) }
                      </ul>
                    </div>
                  }
                </Grid>
                <Grid 
                    item 
                    size={{ xs: 12, sm: 12, md: 12, }}
                >
                  {orderModal && 
                    <div className="inlineFlex maModalPaperBox ">
                      <h4><ReceiptIcon /> Resumen:</h4>
                      <ul className={'dataList'}>
                        <li>
                          Sub total: S/ {orderModal.total ? (parseFloat(orderModal.total) - parseFloat(orderModal.shipping_total)).toFixed(2) : 0}
                        </li>
                        <li>
                          Delivery: S/ {orderModal.shipping_total ? orderModal.shipping_total : 0}
                        </li>
                        <li>
                          Total: S/ {orderModal.total ? orderModal.total : 0}
                        </li>
                      </ul>
                    </div>
                  }
                </Grid>
              </Grid>



            </div>
          </Modal>
        </Container>
      </LayoutCont>
    </LayoutPages>
  )
};

export default OrdenesPage;
