import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarTipo, ListarTipo, BuscarTipo, ActualizarTipo, EliminarTipo, DesactivarTipo } from "../controllers/TipoElemento.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarTipo);
route.get('/listar', validarToken, ListarTipo);
route.get('/buscar/:id', validarToken, BuscarTipo);
route.put('/actualizar/:id', validarToken, ActualizarTipo);
route.delete('/eliminar/:id', validarToken, EliminarTipo);
route.put('/desactivar/:id', validarToken, DesactivarTipo);

export default route;