import { Router } from "express";
import {registrarUsuario, ListarUsuario, EliminarUsuario, BuscarUsuario, ActualizarUsuario, EstadoUsuario, InicioSesion, DesactivarUsuario} from "../controllers/usuario.controller.js";
import { validar_usuario } from "../validators/validate.usuario.js"

const route = Router();

route.post('/registrar', validar_usuario, registrarUsuario);
route.get('/listar', ListarUsuario);
route.delete('/eliminar/:id', EliminarUsuario);
route.get('/buscar/:id', BuscarUsuario);
route.put('/actualizar/:id', ActualizarUsuario);
route.put('/estado/:id', EstadoUsuario);
route.post('/login', InicioSesion);
route.put('/desactivar/:id', DesactivarUsuario); 

export default route;