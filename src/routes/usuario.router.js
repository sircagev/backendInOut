import { Router } from "express";
import {registrarUsuario, ListarUsuario, BuscarUsuario, ActualizarUsuario, DesactivarUsuario, ActualizarPerfil, cambiarContrasena} from "../controllers/usuario.controller.js";
import { validar_usuario } from "../validators/validate.usuario.js"

const route = Router();

route.post('/registrar', validar_usuario, registrarUsuario);
route.get('/listar', ListarUsuario);
route.get('/buscar/:id', BuscarUsuario);
route.put('/actualizar/:id', ActualizarUsuario);
route.put('/perfil/:id', ActualizarPerfil);
route.put('/desactivar/:id', DesactivarUsuario); 
route.put('/contrasena/:id', cambiarContrasena);

export default route;