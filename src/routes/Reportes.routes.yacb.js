import { Router } from "express";
import {ReportePrestamosActivos, ReporteEstadoPrestamos, ReporteHistorialPrestamos, ReporteMovimientosPorTipo, ReporteMovimientosPorUsuario, ReporteMovimientosPorFecha, ReportesUsuarios, ReportesBodegas, ReporteElementosPorCategoria, ReporteElementosPorUbicacion, ReporteInventarioBajo } from "../controllers/ReportesController.yacb.js";

const route = Router();

route.get('/bodegas', ReportesBodegas);
route.get('/movimientostipo', ReporteMovimientosPorTipo);
route.get('/movimientosusuario', ReporteMovimientosPorUsuario);
route.get('/movimientosfecha', ReporteMovimientosPorFecha);
route.get('/movimientosactivos', ReportePrestamosActivos);
route.get('/movimientosestado', ReporteEstadoPrestamos);
route.get('/movimientoshistorial', ReporteHistorialPrestamos);
route.get('/usuarios', ReportesUsuarios);
route.get('/elementoscategoria', ReporteElementosPorCategoria);
route.get('/elementosubicacion', ReporteElementosPorUbicacion);
route.get('/elementosbajostock', ReporteInventarioBajo);

export default route;


