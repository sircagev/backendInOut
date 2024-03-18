//Importaciones de dependencias
import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'

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


const app = express();

//Configuración
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Rutas
app.get('/',(req, res) => {
    res.send('pagina Inicial')
});

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


//Servidor
app.listen(3000, ()=>{
    console.log('El servidor se esta ejecutando en el puerto 3000');
})