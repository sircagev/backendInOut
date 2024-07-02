import { Router } from "express";
import {
  CarryOverActiveLoans,
  CarryOverOfLoansDue,
  HistoryOfLoans,
  CarryOverActiveLoansModal,
  ReportOfMovements,
  ReportOfApplications,
  ReportStockMin,
  stockMinModal,
  ReportOffItems,
  ReportingOfExpiredItems,
  ReportOfElements,
} from "../controllers/Reportes.Controller.yacb.js";

const route = Router();

route.get("/solicitudes", ReportOfApplications);
route.get("/prestamosactivos", CarryOverActiveLoans);
route.get("/prestamos", HistoryOfLoans);
route.get("/prestamosvencidos", CarryOverOfLoansDue);
route.get("/prestamosactivosmodal", CarryOverActiveLoansModal);
route.get("/movimientos", ReportOfMovements);
route.get("/stockmin", ReportStockMin);
route.get("/stockminmodal", stockMinModal);
route.get("/elementosdesactivados", ReportOffItems);
route.get("/elementosexpirados", ReportingOfExpiredItems);
route.get("/elementos", ReportOfElements);

export default route;
