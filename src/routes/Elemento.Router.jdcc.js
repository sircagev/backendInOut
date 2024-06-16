import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarElemento, AñadirStock, ListarElemetos, BuscarElemento, ActualizarElemento, EliminarElemento, DesactivarElementos} from "../controllers/Elemento.controller.jdcc.js";

const route = Router();

route.post('/registrar', validarToken, RegistrarElemento);
route.put('/aniadir/:id', validarToken, AñadirStock);
route.get('/listar', validarToken, ListarElemetos);
route.get('/buscar/:id', validarToken, BuscarElemento);
route.put('/actualizar/:id', validarToken, ActualizarElemento);
route.delete('/eliminar/:id', validarToken, EliminarElemento);
route.put('/desactivar/:id', validarToken, DesactivarElementos);

export default route;