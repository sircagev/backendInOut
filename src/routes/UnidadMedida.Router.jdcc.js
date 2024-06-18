import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarMedida, ListarMedida, Buscarmedida, ActualizarMedida, DesactivarMedida } from "../controllers/UnidadMedida.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarMedida);
route.get('/listar', validarToken, ListarMedida);
route.get('/buscar/:id', validarToken, Buscarmedida);
route.put('/actualizar/:id', validarToken, ActualizarMedida);
route.put('/desactivar/:id', validarToken, DesactivarMedida);

export default route;