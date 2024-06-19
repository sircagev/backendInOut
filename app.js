//Importaciones de dependencias
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import routeBodega from "./src/routes/Bodegas.Router.jeph.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

//Importaciones de rutas
import movimientosRoute from './src/routes/Movimientos.routes.js'
import RouteTipoElemento from "./src/routes/TipoElemento.Router.jdcc.js";
import RouteCategoeria from "./src/routes/Categoria.Router.jdcc.js";
import RouteEmpaque from "./src/routes/Empaque.Router.jdcc.js";
import RouteMedida from "./src/routes/UnidadMedida.Router.jdcc.js";
import RouteUbicacion from "./src/routes/Ubicacion.Router.jdcc.js"
import RouteElemento from "./src/routes/Elemento.Router.jdcc.js";
import RouteUsuario from "./src/routes/usuario.router.js";
import RouteValidar from "./src/routes/validator.router.js";
import reportesRoute from "./src/routes/Reportes.routes.yacb.js";
import RouteContraseña from "./src/routes/password.router.js"


// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Configuración
app.use(cookieParser());
app.use(cors({
    origin: true, //Permitir cualquier origen
    credentials: true //Permitir el uso de cookies
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Rutas
app.get('/', (req, res) => {
    res.send('pagina Inicial')
});

/* app.get('/documents',(req, res) => {
    res.send(documents)
}); */

app.get('/documents', (req, res) => {
    const documentsPath = path.join(__dirname, 'src', 'pages', 'documents.html');
    res.sendFile(documentsPath);
});

app.use('/bodega', routeBodega);

app.use('/tipo', RouteTipoElemento);
app.use('/categoria', RouteCategoeria);
app.use('/empaque', RouteEmpaque);
app.use('/medida', RouteMedida);
app.use('/ubicacion', RouteUbicacion);
app.use('/elemento', RouteElemento);
app.use('/movimientos', movimientosRoute);
app.use('/usuario', RouteUsuario);
app.use('/validate', RouteValidar);
app.use('/reporte', reportesRoute);
app.use('/contrasena', RouteContraseña);


//Servidor
app.listen(3000, () => {
    console.log('El servidor se esta ejecutando en el puerto 3000');
})