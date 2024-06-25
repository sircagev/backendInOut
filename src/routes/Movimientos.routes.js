import { Router } from "express";
import { 
    BuscarMovimiento, 
    ListarTodosMovimientos, 
    RegistrarMovimientoPrestamo, 
    ListarDetallesMovimiento, 
    RegistrarMovimientoIngreso, 
    RegistrarDetalleMovimiento,
    ActualizarDetalleMovimiento 
} from "../controllers/MovimientosController.js";

const route = Router();

route.get('/listar', ListarTodosMovimientos);
route.get('/buscar/:id', BuscarMovimiento);
route.get('/:id/detalles', ListarDetallesMovimiento);
route.post('/registrar', RegistrarMovimientoPrestamo);

route.post('/aniadirStock', RegistrarMovimientoIngreso);

route.post('/:id/aniadirDetalle', RegistrarDetalleMovimiento);

route.put('/actualizarDetalle/:id', ActualizarDetalleMovimiento);

export default route;