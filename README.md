# Asdimor

## Variables de entorno

El proyecto usa `.env.development` y `.env.production` (convención de Create React App) para no
tener URLs y claves hardcodeadas en el código. **Estos dos archivos no se versionan** (ver
`.gitignore`); cada quien crea los suyos localmente a partir de las plantillas:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
```

Luego completa cada variable con sus valores reales. Referencia de qué hace cada una:

| Variable | Descripción |
|---|---|
| `REACT_APP_BASE_URL` | URL base del backend WordPress/WooCommerce |
| `REACT_APP_SITE_URL` | URL pública del sitio (usada en links de compartir / recuperar clave) |
| `REACT_APP_WC_CONSUMER_KEY` / `REACT_APP_WC_CONSUMER_SECRET` | Credenciales de la API REST de WooCommerce |
| `REACT_APP_MP_PUBLIC_KEY` | Public key de Mercado Pago (usa una `TEST-...` en desarrollo) |
| `REACT_APP_MP_PAYMENT_URL` | Endpoint propio que procesa el pago con Mercado Pago |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | API key de Google Maps JavaScript API (restríngela por HTTP referrer) |

> ⚠️ Al ser una SPA (Create React App), todo `REACT_APP_*` queda **incrustado en el bundle JS**
> del build final y es visible para cualquiera que inspeccione el sitio ya publicado (Network/
> Sources del navegador). El `.env` solo evita que estos valores queden expuestos en el código
> fuente del repo — no oculta nada de quien visite el sitio en producción. La API key de
> WooCommerce en particular viaja en cada request desde el navegador; si necesitas que sea
> realmente secreta, esas llamadas deben pasar por un backend propio en vez de ir directo desde
> el cliente.

## CI/CD (GitHub Actions)

`.github/workflows/deploy.yml` compila y despliega por FTP en cada push a `main` (producción) o
`develop` (desarrollo). Antes de que funcione, configura en GitHub **Settings → Environments**
dos entornos llamados `production` y `development`, y en cada uno sus secrets (mismos nombres,
valores distintos):

- Todas las `REACT_APP_*` de la tabla de arriba
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
