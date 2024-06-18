import { Router } from "express";
import {
  ReportePrestamosActivos,
  PrestamosActivosModal,
  ReporteHistorialMovimientos,
  ReporteSolicitudesUsuario,
  stockMinElementos,
  stockMinModal,
} from "../controllers/ReportesController.yacb.js";

const route = Router();

route.get("/solicitudesusuario", ReporteSolicitudesUsuario);
route.get("/prestamosactivos", ReportePrestamosActivos);
route.get("/prestamosactivosmodal", PrestamosActivosModal);
route.get("/movimientoshistorial", ReporteHistorialMovimientos);
route.get("/stockminelementos", stockMinElementos);
route.get("/stockminmodal", stockMinModal);

export default route;
