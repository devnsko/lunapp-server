import { Router } from "express";
import apodRateController from "../controllers/apodRateController";

const router = Router();

router.get('/hasLike', apodRateController.hasLike);
router.post('/like', apodRateController.addLike);
router.post('/unlike', apodRateController.removeLike);
router.get('/likes', apodRateController.countLikes);

export default router;