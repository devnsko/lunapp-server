import { Router, Request, Response } from "express";
import { NeoClosest } from "../controllers/neoController";
import { validateQuery } from "../utils/queryValidate";
const router = Router();

router.get("/near", validateQuery, NeoClosest);

export default router;