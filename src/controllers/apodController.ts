import apodDB from "../services/database/requests/apodRequest";
import { Request, Response } from "express";
import fetchAPOD from "../apis/apod";
import { ApodData, ApodModel } from "../services/database/schemas";
import { connectRedis, disconnectRedis } from "../services/redis/redisClient";

export default async function APOD(req: Request, res: Response) {
    try {
        let apodData: ApodModel ;

        let date: string = req.query.date as string;
        if (!date) {
            const today = new Date();
            date = today.toISOString().split('T')[0];
        }

        // Redis connection
        const redis = await connectRedis();
        const cacheKey = `apod:${date}`;
        const cachedData = await redis.get(cacheKey);
        let getResponse: ApodModel | null = await JSON.parse(cachedData as string);

        if (!getResponse) {
            getResponse = await apodDB.select(date);

            if (getResponse) {
                apodData = getResponse;
            } else {
                const fetchData = await fetchAPOD(date);
                apodData = await apodDB.insert(fetchData as ApodData);
            }
            await redis.set(cacheKey, JSON.stringify(apodData), {'EX': 60 * 60 * 24});
        } else {
            apodData = getResponse;
        }
        return res.status(200).json(apodData);
    } catch (error) {
        console.error('APOD Error:', error);
        res.status(500).json({ message: error });
    }
    
}