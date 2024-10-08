import { Router, Request, Response } from "express";
import { NeoClosest } from "../controllers/neoController";
import { validateQuery } from "../utils/queryValidate";
const router = Router();

router.get("/", validateQuery, NeoClosest);

export default router;