import { Router, Request, Response } from "express";
import { NeoYear } from "../controllers/neoController";
const router = Router();

router.get("/near", NeoYear);

export default router;