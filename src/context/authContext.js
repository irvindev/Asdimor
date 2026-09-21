import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const STORAGE_TOKEN_KEY = 'aftkn';
const STORAGE_CART_KEY = 'cartProducts';
const BASE_URL = process.env.REACT_APP_BASE_URL;
const EXPIRATION_DURATION = 1000 * 60 * 60 * 12; // 12 horas

const KEYS_WC = {
    ck: process.env.REACT_APP_WC_CONSUMER_KEY,
    cs: process.env.REACT_APP_WC_CONSUMER_SECRET
};


// Asegúrate de definir la URL de tu endpoint GraphQL en las variables de entorno o constantes
const GRAPHQL_URL = `${BASE_URL}graphql`;

const GET_INITIAL_DATA = `
  query GetInitialData {
    # Campos de GET_GLOBAL_DATA
    infoGeneral: page(id: "544", idType: DATABASE_ID) {
        configuracionesFields {
        confAnun { confAnunTxt }
        congMenu { confMenuNombre confMenuLink }
        confRs { confRsTxt confRsIco { node { sourceUrl } } }
        confDir
        confDi { confDiNombre confDiLink }
        confPopup
        confPopupSwitch
        confPopupImg { node { sourceUrl altText } }
        }
    }
    # Campos de GET_HOME_DATA
    homeInfo: page(id: "458", idType: DATABASE_ID) {
        databaseId
        title
        seo {
        title
        metaDesc
        canonical
        focuskw
        metaKeywords
        opengraphTitle
        opengraphDescription
        opengraphImage {
            sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
            sourceUrl
        }
        }
        pageHome {
        introSecciones {
            __typename
            ... on PageHomeIntroSeccionesHsecIntroLayout {
            hsecIntroSwitch
            hsecIntroTxt
            hsecIntroImg {
                node {
                sourceUrl
                altText
                }
            }
            hsecIntroImglink
            hsecIntroProductos {
                nodes {
                ... on Product {
                    id
                    databaseId
                    name
                    slug
                    featuredImage {
                    node {
                        sourceUrl
                    }
                    }
                }
                }
            }
            }
            ... on PageHomeIntroSeccionesHsecCategoriaLayout {
            hsecCategoriaTitulo
            hsecCategoriaCat {
                nodes {
                ... on ProductCategory {
                    id
                    databaseId
                    name
                    slug
                }
                }
            }
            }
            ... on PageHomeIntroSeccionesHsecPubLayout {
            hsecPubList {
                hsecPubLimg {
                node {
                    sourceUrl
                    altText
                }
                }
                hsecPubLtxt
            }
            }
            ... on PageHomeIntroSeccionesHsecTranosLayout {
            hsecTranosTxt
            hsecTranosImg {
                node {
                sourceUrl
                altText
                }
            }
            }
            ... on PageHomeIntroSeccionesHsecExplorarLayout {
            hsecExplorarTitulo
            }
        }
        }
    }
    productCategories(first: 100) {
        nodes {
        databaseId
        name
        slug
        description
        image {
            sourceUrl
        }
        }
    }
  }
`;

const GET_PROD_DATA = `
    query GetProducts {
    products: products(first: 100, where: {status: "publish"}) {
            nodes {
            databaseId
            name
            slug
            seo {
                title
                metaDesc
                canonical
                focuskw
                metaKeywords
                opengraphTitle
                opengraphDescription
                opengraphImage {
                sourceUrl
                }
                twitterTitle
                twitterDescription
                twitterImage {
                sourceUrl
                }
            }

            ... on SimpleProduct {
                price(format: RAW)
                regularPrice(format: RAW)
                salePrice(format: RAW)
                productsAditional {
                prodacfIfportadaSwitch
                prodacfIfpromSwitch
                prodacfSinopsis
                prodacfDtNpag
                prodacfDtAno
                prodacfDtEnc
                prodacfDtTamano
                prodacfDtPeso
                prodacfDtIsbn
                prodacfOthertxt
                prodacfIfportadasList {
                    fieldGroupName
                }
                }
                        productoCuaderno {
                # Galería (Array de URLs según la configuración de ACF)
                prodacfPortadas {
                    nodes {
                        sourceUrl
                        altText
                    }
                }
                # Repeater: Lista adicional
                prodacfAditional {
                    prodacfAditionalDescripcion
                    prodAcfPortadasValor
                    prodAcfPortadasVerify
                }
                }
                    productoVolante {
                # Repeater: Lista de volantes
                prodacfVol {
                    prodacfVolDescripcion
                    prodacfVolImg{
                                    node{
                                        sourceUrl
                                    }
                                }
                }
                }
            }
            ... on VariableProduct {
                price(format: RAW)
                regularPrice(format: RAW)
                salePrice(format: RAW)
            }
            productCategories {
                nodes {
                databaseId
                name
                }
            }
            taxEncuadernacion{
                        nodes {
                            databaseId
                        }
                    }
                    taxFormato{
                        nodes {
                            databaseId
                            name
                        }
                    }
                    taxMedidas{
                        nodes {
                            databaseId
                            name
                        }
                    }
                    taxProducto{
                        nodes {
                            databaseId
                            name
                        }
                    }
            featuredImage {
                node {
                sourceUrl
                }
            }
            galleryImages {
                nodes {
                sourceUrl
                }
            }
            }
        }
    }
`;

export default function AuthContextProvider({ children }) {
    // 1. Estados iniciales seguros
    const [token, setToken] = useState(() => {
        try {
            const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
            return storedToken ? JSON.parse(storedToken) : null;
        } catch {
            return null;
        }
    });

    const [infoGeneral, setInfoGeneral] = useState(null);
    const [homeInfo, setHomeInfo] = useState(null);
    const [productCategories,setProductCategories] = useState(null);
    const [allProducts, setAllProducts] = useState(null);
    const [deliveryDep, setDeliveryDep] = useState('Lima');
    const [deliveryMethod, setDeliveryMethod] = useState(null); // null hasta que el usuario elija 'domicilio' o 'tienda'
    const [loadGeneral, setLoadGeneral] = useState(0);
    const [loginOpen, setLoginOpen] = useState(false);
    const [cartMenuOpen, setCartMenuOpen] = useState(false);
    //const [loadingProducts, setLoadingProducts] = useState(true);

    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem(STORAGE_CART_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // 2. Persistencia automática del carrito al cambiar
    useEffect(() => {
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    // Expiración y temporizador limpio
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem(STORAGE_CART_KEY);
            setCartItems([]);
        }, EXPIRATION_DURATION);

        return () => clearTimeout(timer);
    }, []);

    // 3. Manejo de autenticación con useCallback
    const handleUpdateToken = useCallback((data) => {
        localStorage.setItem(STORAGE_TOKEN_KEY, JSON.stringify(data));
        setToken(data);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        setToken(null);
    }, []);

    // 4. Operaciones del Carrito memoizadas con useCallback
    const addItemToCart = useCallback((product) => {
        setCartItems((prevCart) => {
            // Caso especial ID 341
            if (product.id === 341) {
                return [
                    ...prevCart,
                    {
                        ...product,
                        cartItemId: crypto.randomUUID(),
                        amount: product.amount ?? 1
                    }
                ];
            }

            const inCart = prevCart.find((item) => item.cartItemId === product.cartItemId);

            if (inCart) {
                return prevCart.map((item) =>
                    item.cartItemId === product.cartItemId
                        ? { ...item, amount: item.amount + 1 }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    amount: product.amount ?? 1,
                    cartItemId: crypto.randomUUID()
                }
            ];
        });
    }, []);

    const deleteItemToCart = useCallback((product) => {
        setCartItems((prevCart) => {
            const inCart = prevCart.find((item) => item.cartItemId === product.cartItemId);
            if (!inCart) return prevCart;

            if (inCart.amount === 1) {
                return prevCart.filter((item) => item.cartItemId !== product.cartItemId);
            }

            return prevCart.map((item) =>
                item.cartItemId === product.cartItemId
                    ? { ...item, amount: item.amount - 1 }
                    : item
            );
        });
    }, []);

    const removeItemToList = useCallback((product) => {
        setCartItems((prevCart) =>
            prevCart.filter((item) => item.cartItemId !== product.cartItemId)
        );
    }, []);

    const emptyCart = useCallback(() => {
        localStorage.removeItem(STORAGE_CART_KEY);
        setCartItems([]);
    }, []);

    const getInfGeneral = useCallback(async () => {
        const startTime = performance.now();
        const getTime = () => `[+${(performance.now() - startTime).toFixed(0)}ms]`;

        console.log(`🚀 ${getTime()} INICIO: Solicitando GET_INITIAL_DATA (Global + Home + Categorías)`);
        
        // 1. Iniciamos incremento aleatorio de la barra
        setLoadGeneral(10);
        const interval = setInterval(() => {
            setLoadGeneral((prev) => {
                if (prev >= 85) {
                    clearInterval(interval);
                    return 85;
                }
                return prev + Math.floor(Math.random() * 11 + 5);
            });
        }, 300);

        try {
            // 2. Ejecutamos la consulta unificada en una sola solicitud HTTP
            const resInitial = await axios.post(
                GRAPHQL_URL, 
                { query: GET_INITIAL_DATA }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            const initialData = resInitial.data?.data;

            if (initialData) {
                // A. Procesamos Info General
                if (initialData.infoGeneral) {
                    setInfoGeneral(initialData.infoGeneral);
                }

                // B. Procesamos Info del Home
                if (initialData.homeInfo) {
                    setHomeInfo(initialData.homeInfo);
                }

                // C. Procesamos las Categorías de Productos
                if (initialData.productCategories?.nodes) {
                    setProductCategories(initialData.productCategories.nodes);
                }
            }

            console.log(`✅ ${getTime()} PETICIÓN INICIAL COMPLETA: Todo el cascarón cargado`);

        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
        } finally {
            // 3. Finalizamos el loader y mostramos la página de inmediato
            clearInterval(interval);
            setLoadGeneral(100);
            console.log(`🎉 ${getTime()} FIN LOADER: Interfaz desplegada`);
        }

        // 4. SEGUNDO PLANO: Petición de Productos (No bloqueante)
        (async () => {
            try {
                console.log(`⏳ ${getTime()} SEGUNDO PLANO: Solicitando GET_PROD_DATA...`);
                const resProd = await axios.post(
                    GRAPHQL_URL, 
                    { query: GET_PROD_DATA }, 
                    { headers: { 'Content-Type': 'application/json' } }
                );
                const prodData = resProd.data?.data;

                if (prodData?.products?.nodes) {
                    const rawProducts = prodData.products.nodes;

                    const formattedProducts = rawProducts.map((product) => {
                        const images = [];
                        if (product.featuredImage?.node?.sourceUrl) {
                            images.push({ src: product.featuredImage.node.sourceUrl });
                        }
                        if (product.galleryImages?.nodes?.length > 0) {
                            product.galleryImages.nodes.forEach((img) => {
                                if (img?.sourceUrl) images.push({ src: img.sourceUrl });
                            });
                        }

                        const categoriesNodes = product.productCategories?.nodes || [];
                        const category_ids = categoriesNodes.map((cat) => cat.databaseId);
                        const categories = categoriesNodes.map((cat) => ({ name: cat.name }));

                        const tax_productos = (product.taxProducto?.nodes || product.taxProductos?.nodes || []).map(
                            (t) => t.databaseId
                        );
                        const tax_medidas = product.taxMedidas?.nodes?.map((t) => t.databaseId) || [];
                        const tax_encuadernacion = product.taxEncuadernacion?.nodes?.map((t) => t.databaseId) || [];

                        return {
                            id: product.databaseId,
                            name: product.name,
                            slug: product.slug,
                            seo: product.seo || null,
                            price: product.price || "",
                            regular_price: product.regularPrice || "",
                            sale_price: product.salePrice || "",
                            category_ids,
                            categories,
                            tax_productos,
                            tax_medidas,
                            tax_encuadernacion,
                            images
                        };
                    });

                    setAllProducts(formattedProducts);
                }
                console.log(`✅ ${getTime()} SEGUNDO PLANO COMPLETO: Productos listos`);
            } catch (prodError) {
                console.error('Error cargando Productos en segundo plano:', prodError);
            }
        })();

    }, []);


    useEffect(() => {
        getInfGeneral();
    }, [getInfGeneral]);

    // 6. Cálculo de Totales Derivado (Memoizado)
    const totals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0;
            return acc + price * item.amount;
        }, 0);

        let delivery = 0;
        if (deliveryMethod === 'domicilio') {
            if (deliveryDep === 'Lima' || deliveryDep === 'Callao') {
                delivery = subtotal > 150 ? 0 : 15;
            } else {
                delivery = subtotal > 150 ? 0 : 15; // Ajustar regla de envío si aplica a otras provincias
            }
        }
        // deliveryMethod === 'tienda' o null (aún no elegido) => delivery = 0

        return {
            subtotal,
            delivery,
            total: subtotal + delivery
        };
    }, [cartItems, deliveryDep, deliveryMethod]);

    // 7. Objeto Contextual Estable
    const value = useMemo(
        () => ({
            token,
            cartItems,
            cartMenuOpen,
            keysWc: KEYS_WC,
            infoGeneral,
            homeInfo,
            productCategories,
            allProducts,
            loadGeneral,
            baseUrl: BASE_URL,
            deliveryDep,
            deliveryMethod,
            loginOpen,
            totals, // Retorna directamente subtotal, delivery y total calculados
            setDeliveryDep,
            setDeliveryMethod,
            setCartMenuOpen,
            setLoginOpen,
            handleUpdateToken,
            addItemToCart,
            deleteItemToCart,
            removeItemToList,
            emptyCart,
            handleLogout
        }),
        [
            token,
            cartItems,
            cartMenuOpen,
            infoGeneral,
            homeInfo,
            productCategories,
            allProducts,
            loadGeneral,
            deliveryDep,
            deliveryMethod,
            loginOpen,
            totals,
            handleUpdateToken,
            addItemToCart,
            deleteItemToCart,
            removeItemToList,
            emptyCart,
            handleLogout
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    return useContext(AuthContext);
}