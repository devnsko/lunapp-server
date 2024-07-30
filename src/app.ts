import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { dbConnect } from "./services/database/database";

import check from "./check";
import generate from "./auto";
import apodRouter from "./routes/apodRoute";
import neoRouter from "./routes/neoRoute";

console.log("🚀 [Server]: Starting server...");
dbConnect();

const PORT = process.env.PORT || 6000;
const app: Express = express();

app.use(cors({
  origin: 'https://devnsko.com', // Ваш клиентский домен
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/today', apodRouter);
app.use('/api/v1/neo', neoRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

