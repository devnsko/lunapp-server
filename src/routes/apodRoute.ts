import { Router } from "express";
import APOD from "../controllers/apodController";
import { validateQuery } from "../utils/queryValidate";
const router = Router();

router.get("/today", validateQuery, APOD);

export default router;