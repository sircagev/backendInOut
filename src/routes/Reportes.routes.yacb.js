import { Router } from "express";
import {
  ReportePrestamosActivos,
  ReporteTodosPrestamos,
  PrestamosActivosModal,
  ReporteHistorialMovimientos,
  ReporteSolicitudesUsuario,
  stockMinElementos,
  stockMinModal,
  ReporteElementosDesactivados,
  ReporteElementos,
} from "../controllers/ReportesController.yacb.js";

const route = Router();

route.get("/solicitudesusuario", ReporteSolicitudesUsuario);
route.get("/prestamosactivos", ReportePrestamosActivos);
route.get("/prestamos", ReporteTodosPrestamos);
route.get("/prestamosactivosmodal", PrestamosActivosModal);
route.get("/movimientoshistorial", ReporteHistorialMovimientos);
route.get("/stockminelementos", stockMinElementos);
route.get("/stockminmodal", stockMinModal);
route.get("/elementosdesactivados", ReporteElementosDesactivados);
route.get("/elementos", ReporteElementos);

export default route;
