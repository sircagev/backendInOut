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
  LoansDueModal,
  ReportOffItems,
  ReportOfElements,
  ExpiredModal,
  ReportingOfExpiredItems,
  ApplicationsModal,
  PieOfMovements,
  PieOfLoans,
  PieOfLoansApi,
  PieConsumable,
  PieOfMovementsApi,
} from "../controllers/Reportes.Controller.yacb.js";

const route = Router();

route.get("/solicitudes", ReportOfApplications);
route.get("/prestamosactivos", CarryOverActiveLoans);
route.get("/prestamos", HistoryOfLoans);
route.get("/prestamosvencidos", CarryOverOfLoansDue);
route.get("/prestamosvencidosmodal", LoansDueModal);
route.get("/prestamosactivosmodal", CarryOverActiveLoansModal);
route.get("/movimientos", ReportOfMovements);
route.get("/movimientospie", PieOfMovements);
route.get("/prestamospie", PieOfLoans);
route.get("/prestamosapi", PieOfLoansApi);
route.get("/consumiblespie", PieConsumable);
route.get("/consumiblesapi", PieOfMovementsApi);
route.get("/stockmin", ReportStockMin);
route.get("/stockminmodal", stockMinModal);
route.get("/elementosdesactivados", ReportOffItems);
route.get("/elementosexpirados", ReportingOfExpiredItems);
route.get("/elementosexpiradosmodal", ExpiredModal);
route.get("/elementos", ReportOfElements);
route.get("/solicitudesmodal", ApplicationsModal);

export default route;
