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
                let fetchData: ApodData;
                try {
                    
                    fetchData = await fetchAPOD(date);
                } catch (error) {   
                    const dayBefore = new Date(date);
                    dayBefore.setDate(dayBefore.getDate() - 1);
                    fetchData = await fetchAPOD(dayBefore.toISOString().split('T')[0]);
                }
                
                apodData = await apodDB.insert(fetchData as ApodData);
            }
            await redis.set(cacheKey, JSON.stringify(apodData), {'EX': 60 * 60 * 1});
        } else {
            apodData = getResponse;
        }
        return res.status(200).json(apodData);
    } catch (error) {
        console.error('APOD Error:', error);
        res.status(500).json({ message: error });
    }
    
}

export async function galleryAPOD(req: Request, res: Response) {
    try {
        
        let lastDate: string = req.query['last-date'] as string ?? (new Date()).toISOString().split('T')[0];
        let range: number = Number(req.query.range) ?? 5;

        let galleryData: ApodModel[] = [];
        let date = new Date(lastDate);

        for (let i = 0; i < range; i++) {
            const currentDate = new Date(date);
            currentDate.setDate(date.getDate() - i);
            const dateString = currentDate.toISOString().split('T')[0];
            
            // Redis connection
            const redis = await connectRedis();
            const cacheKey = `apod:${dateString}`;
            const cachedData = await redis.get(cacheKey);
            let getResponse: ApodModel | null = await JSON.parse(cachedData as string);

            if (getResponse) {
                galleryData.push(getResponse);
                continue;
            }

            getResponse = await apodDB.select(dateString);

            if (getResponse) {
                galleryData.push(getResponse);
                await redis.set(cacheKey, JSON.stringify(getResponse), {'EX': 60 * 60 * 1});
                continue;
            }

            
            let fetchData: ApodData;
            try {
                fetchData = await fetchAPOD(dateString);
            } catch (error) {   
                const dayBefore = new Date(dateString);
                dayBefore.setDate(dayBefore.getDate() - 1);
                const beforeDateString = dayBefore.toISOString().split('T')[0];
                fetchData = await fetchAPOD(beforeDateString);
            }
            const apodModel: ApodModel = await apodDB.insert(fetchData as ApodData);
            galleryData.push(apodModel);
            await redis.set(cacheKey, JSON.stringify(apodModel), {'EX': 60 * 60 * 1});
        }

        return res.status(200).json(galleryData);
    } catch (error) {
        console.error('Gallery APOD Error:', error);
        res.status(500).json({ message: error });
    }
}