import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { RegistrarBodega, listarBodegas, BuscarBodega, ActualizarBodega, DesactivarBodega } from "../controllers/Bodegas.Controllers.jeph.js";

const route = Router();

route.post('/registrar',  RegistrarBodega);
route.get('/listar', validarToken, listarBodegas);
route.get('/buscar/:id', validarToken, BuscarBodega)
route.put('/actualizar/:id', validarToken, ActualizarBodega);
route.put('/desactivar/:id', validarToken, DesactivarBodega);


export default route;