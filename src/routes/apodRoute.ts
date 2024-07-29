import { Router } from "express";
import APOD from "../controllers/apodController";
import { validateQuery } from "../utils/queryValidate";
const router = Router();

router.get("/", validateQuery, APOD);

export default router;