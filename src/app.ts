import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";

import * as apis from './apis';
import check from "./check";
import generate from "./auto";

const PORT = process.env.PORT || 5000;
const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

app.get("/today", async (req: Request, res: Response) => {
    const photoOfDay = await apis.photoOfDay();
    res.json(photoOfDay);
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