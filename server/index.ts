import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import log4js from "log4js";
import next from "next";

import apiRouter from "./routes/api";
import authRouter from "./routes/auth";
import mediaRouter from "./routes/media";
import { accessLogger, expressLogger } from "./utils/logger";

const dev = process.env.NODE_ENV === "development";
const port = 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.disable("x-powered-by");

    server.use(express.json());
    server.use(log4js.connectLogger(accessLogger, {}));
    server.use((req, _, next) => {
      if (!req) return next();

      if (req.method === "GET" || req.method === "DELETE") {
        accessLogger.info(req.query);
      } else {
        accessLogger.info(req.body);
      }

      next();
    });

    server.use(authRouter);
    server.use("/media", mediaRouter);
    server.use("/api", apiRouter);

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.use((err: Error, req: any, res: any, next: any) => {
      expressLogger.error(err.message);
      expressLogger.debug(err.stack);

      res.status(500).json({ error: "Internal Server Error" });
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;

      expressLogger.info(
        `> Ready on localhost:${port} - env: ${process.env.NODE_ENV}`
      );
    });
  } catch (e) {
    console.error(e);
  }
})();
