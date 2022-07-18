import * as dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import next from "next";

import apiRouter from "./routes/api";
import imagesRouter from "./routes/images";

const dev = process.env.NODE_ENV === "development";
const port = 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.use("/api", apiRouter);
    server.use("/images", imagesRouter);

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(
        `> Ready on localhost:${port} - env: ${process.env.NODE_ENV}`
      );
    });
  } catch (e) {
    console.error(e);
  }
})();
