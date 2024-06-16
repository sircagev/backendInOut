import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarEmpaque, ListarEmpaque, BuscarEmpaque, ActualizarEmpaque, DesactivarEmpaque } from "../controllers/Empaque.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarEmpaque);
route.get('/listar', validarToken, ListarEmpaque);
route.get('/buscar/:id', validarToken, BuscarEmpaque);
route.put('/actualizar/:id', validarToken, ActualizarEmpaque);
route.put('/desactivar/:id', validarToken, DesactivarEmpaque);

export default route;