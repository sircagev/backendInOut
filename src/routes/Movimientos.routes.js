import { Router } from "express";
import { BuscarMovimiento, ListarTodosMovimientos, RegistrarMovimientoPrestamo, ListarDetallesMovimiento } from "../controllers/MovimientosController.js";

const route = Router();

route.get('/listar', ListarTodosMovimientos);
route.get('/buscar/:id', BuscarMovimiento);
route.get('/:id/detalles', ListarDetallesMovimiento);
route.post('/registrar', RegistrarMovimientoPrestamo);

export default route;