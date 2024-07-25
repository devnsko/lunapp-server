import apodDB from "../database/requests/apodRequest";
import { Request, Response } from "express";
import fetchAPOD from "../apis/apod";
import IPhotoOfDay from "../types/photoOfDay";
import { ApodData, ApodModel } from "../database/schemas";

export default async function APOD(req: Request, res: Response) {
    try {
        let apodData: ApodModel;
        const date = req.query.date as string;
        const getResponse: ApodModel | null = await apodDB.select(date);

        if (getResponse) {
            apodData = getResponse;
        } else {
            const fetchData = await fetchAPOD(date);
            apodData = await apodDB.insert(fetchData as ApodData);
        }
        return res.json(apodData);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching data' });
    }
    
}