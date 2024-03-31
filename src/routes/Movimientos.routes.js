import { Router } from "express";
import { BuscarMovimiento, ListarTodosMovimientos, RegistrarMovimientoPrestamo } from "../controllers/MovimientosController.js";

const route = Router();

route.get('/listar', ListarTodosMovimientos);
route.get('/buscar/:id', BuscarMovimiento);
route.post('/registrar', RegistrarMovimientoPrestamo);

export default route;