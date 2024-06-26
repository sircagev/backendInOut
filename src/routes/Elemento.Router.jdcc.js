import { Router } from "express";
import { RegistrarElemento, AñadirStock, ListarElemetos, BuscarElemento, ActualizarElemento, EliminarElemento, DesactivarElementos} from "../controllers/Elemento.controller.jdcc.js";

const route = Router();

route.post('/registrar', RegistrarElemento);
route.put('/aniadir/:id', AñadirStock);
route.get('/listar', ListarElemetos);
route.get('/buscar/:id', BuscarElemento);
route.put('/actualizar/:id', ActualizarElemento);
route.delete('/eliminar/:id', EliminarElemento);
route.put('/desactivar/:id', DesactivarElementos);

export default route;