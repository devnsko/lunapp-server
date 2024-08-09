import { Router } from "express";
import apodRateController from "../controllers/apodRateController";
import { ratePostQueryValidate } from "../utils/rateValidate";

const router = Router();

router.get('/hasLike', ratePostQueryValidate, apodRateController.hasLike);
router.post('/like', ratePostQueryValidate, apodRateController.addLike);
router.post('/unlike', ratePostQueryValidate, apodRateController.removeLike);
router.get('/likes', ratePostQueryValidate, apodRateController.countLikes);
router.get('/myLikes', apodRateController.myLikes)

export default router;