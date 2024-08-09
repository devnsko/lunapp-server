import { Request, Response } from "express";
import { ApodRateData, ApodRateModel } from "../services/database/schemas";
import apodRateRequest from "../services/database/requests/apodRateRequest";

export async function countLikes(req: Request, res: Response) {
    const { apodId } = req.body;
    const count = apodRateRequest.countLikes(apodId);
    res.json({
        apodId,
        likes: count
    })
}

export async function addLike(req: Request, res: Response) {
    const {apodId} = req.body;
    const rate: ApodRateModel = await apodRateRequest.addLike({post_id: apodId, user_id: req.user} as ApodRateData);
    res.json({
        apodId: rate.post_id,
        likeId: rate.id,
        liked: true,
        likedAt: rate.rated_at

    })
}

export async function removeLike(req: Request, res: Response) {
    const { apodId } = req.body;
    const rate = await apodRateRequest.removeLike({post_id: apodId, user_id: req.user} as ApodRateData);
    res.json({
        apodId: rate.post_id,
        likeId: rate.id,
        liked: false,
        likedAt: rate.rated_at

    })
}

export async function hasLike(req: Request, res: Response) {
    const { apodId } = req.body;
    const liked = await apodRateRequest.hasLiked({post_id: apodId, user_id: req.user} as ApodRateData);
    
    return res.json({
        apodId,
        liked: liked ? true : false
    })
}

export default {
    hasLike,
    addLike,
    removeLike,
    countLikes
}