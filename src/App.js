import logo from './logo.svg';
//import './assets/css/global.scss';

import '../src/assets/css/global.scss';

import AuthContextProvider from './context/authContext';

import { BrowserRouter,Route,Routes } from "react-router";
import HomePage from './pages/home/home';
import TiendaPage from './pages/tienda/tienda';
import DetallePage from './pages/detalle/detalle';
import CartPage from './pages/carrito/carrito';
import CheckoutPage from './pages/checkout/checkout';
import EncuentranosPage from './pages/encuentranos/encuentranos';
import NosotrosPage from './pages/nosotros/nosotros';
import ServiciosPage from './pages/servicios/servicios';
import CatalogoPage from './pages/catalogo/catalogo';
import DescargasPage from './pages/descargas/descargas';
import MyAccount from './pages/mi-cuenta/mi-cuenta';
import LibroDeReclamosPage from './pages/libro-de-reclamos/libro-de-reclamos';
import PoliticasDePrivacidadPage from './pages/politicas-de-privacidad/politicas-de-privacidad';
import TerminosCondicionesPage from './pages/terminos-y-condiciones/terminos-y-condiciones';
import RegistroPage from './pages/registro/registro';
import RecuperarClavePage from './pages/recuperar-clave/recuperar-clave';
import OrdenesPage from './pages/ordenes/ordenes';
import RestablecerClavePage from './pages/recuperar-clave/restablecer-clave';


function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/tienda' element={<TiendaPage />} />
          <Route path='/tienda/:slug' element={<DetallePage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/encuentranos' element={<EncuentranosPage />} />
          <Route path='/nosotros' element={<NosotrosPage />} />
          <Route path='/servicios' element={<ServiciosPage />} />
          <Route path='/catalogo' element={<CatalogoPage />} />
          <Route path='/libro-de-reclamos' element={<LibroDeReclamosPage />} />
          <Route path='/politicas-de-privacidad' element={<PoliticasDePrivacidadPage />} />
          <Route path='/terminos-y-condiciones' element={<TerminosCondicionesPage />} />
          <Route path='/descargas' element={<DescargasPage />} />
          <Route path='/mi-cuenta' element={<MyAccount />} />
          <Route path='/mi-cuenta/ordenes' element={<OrdenesPage />} />
          <Route path='/registro' element={<RegistroPage />} />
          <Route path='/recuperar-clave' element={<RecuperarClavePage />} />
          <Route path='/restablecer-clave' element={<RestablecerClavePage />} /> 
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
