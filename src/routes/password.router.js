import { Router } from "express"
import { password } from "../controllers/password.controller.js"

const route = Router();

route.post("/recuperar", password.tokenPassword);
route.put("/reset", password.resetPassword);

export default route;