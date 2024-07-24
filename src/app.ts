import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { dbQuery, dbConnect } from "./database/database";

import * as apis from './apis';
import check from "./check";
import generate from "./auto";


console.log("🚀 [Server]: Starting server...");
dbConnect();

const PORT = process.env.PORT || 6000;
const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.get("/today", async (req: Request, res: Response) => {
    try {

        const photoOfDay = await apis.photoOfDay(req.query.date as string);
        res.json(photoOfDay);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching data' });
    }
});

app.get("/near", async (req: Request, res: Response) => {
    const { year } = req.query;
    const closestEarthObject = await apis.NearEarthObjectOfYear(year as string);
    res.json(closestEarthObject);
});

app.get("/check", async (req: Request, res: Response) => {
    const response = await check();
    res.json(response);
});

app.get("/auto", async (req: Request, res: Response) => {
    await generate(req, res);
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

