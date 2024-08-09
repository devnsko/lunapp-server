import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { dbConnect } from "./services/database/database";
import checkAuth from "./utils/checkAuth";

import userRouter from "./routes/userRoute";
import apodRouter from "./routes/apodRoute";
import neoRouter from "./routes/neoRoute";
import rateRouter from "./routes/rateRoute";
import rateLimit from "express-rate-limit";
import errorMiddleware from "./middlewares/error-middleware";

console.log("🚀 [Server]: Starting server...");
dbConnect();

const PORT = process.env.PORT || 6000;
const app: Express = express();

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 90,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  }
}));

app.use(cors({
  origin: 'https://devnsko.com', // Ваш клиентский домен
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/today', checkAuth, apodRouter);
app.use('/api/v1/rate', rateRouter)
app.use('/api/v1/neo', neoRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

