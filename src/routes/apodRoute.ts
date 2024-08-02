import { Router } from "express";
import APOD, { galleryAPOD } from "../controllers/apodController";
import { validateQuery } from "../utils/queryValidate";
import { galleryQueryValidate } from "../utils/galleryQueryValidate";

const router = Router();

router.get("/", validateQuery, APOD);

router.get("/gallery", galleryQueryValidate, galleryAPOD);

export default router;