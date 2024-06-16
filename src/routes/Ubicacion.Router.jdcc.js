import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarUbicacion, ListarUbicacion, BuscarUbicacion, ActualizarUbicacion, Desactivarubicacion } from "../controllers/Ubicacion.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarUbicacion);
route.get('/listar', validarToken, ListarUbicacion);
route.get('/buscar/:id', validarToken, BuscarUbicacion);
route.put('/actualizar/:id', validarToken, ActualizarUbicacion);
route.put('/desactivar/:id', validarToken, Desactivarubicacion);

export default route;