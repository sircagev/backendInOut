import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarCategoria, ListarCategoria, BuscarCategoria, ActualizarCategoria, DesactivarCategoria } from "../controllers/Categoria.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarCategoria);
route.get('/listar', validarToken, ListarCategoria);
route.get('/buscar/:id', validarToken, BuscarCategoria);
route.put('/actualizar/:id', validarToken, ActualizarCategoria);
route.put('/desactivar/:id', validarToken, DesactivarCategoria);

export default route;