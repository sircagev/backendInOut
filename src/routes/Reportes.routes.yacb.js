import { Router } from "express";
import {ReportePrestamosActivos, ReporteHistorialPrestamos, ReporteMovimientosPorTipo, ReporteMovimientosPorUsuario, ReporteMovimientosPorFecha, ReportesUsuarios, ReportesBodegas, ReporteElementosPorCategoria, ubicacionElementos, ReporteInventarioBajo } from "../controllers/ReportesController.yacb.js";

const route = Router();

route.get('/bodegas', ReportesBodegas);
route.get('/movimientostipo', ReporteMovimientosPorTipo);
route.get('/movimientosusuario', ReporteMovimientosPorUsuario);
route.get('/movimientosfecha', ReporteMovimientosPorFecha);
route.get('/movimientosactivos', ReportePrestamosActivos);
route.get('/movimientoshistorial', ReporteHistorialPrestamos);
route.get('/usuarios', ReportesUsuarios);
route.get('/elementoscategoria', ReporteElementosPorCategoria);
route.get('/elementosubicacion', ubicacionElementos);
route.get('/elementosbajostock', ReporteInventarioBajo);

export default route;


