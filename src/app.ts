import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { dbConnect } from "./database/database";

import check from "./check";
import generate from "./auto";
import apodRouter from "./routes/apodRoute";
import neoRouter from "./routes/neoRoute";

console.log("🚀 [Server]: Starting server...");
dbConnect();

const PORT = process.env.PORT || 6000;
const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apodRouter);
app.use(neoRouter);

const server = http.createServer(app);

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

