import { PrismaClient } from "@prisma/client";

import { prismaLogger as logger } from "./logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("query", (e) => {
  logger.debug(`${e.duration}ms ${e.query}`);
});

prisma.$on("error", (e) => {
  logger.error(e.message);
});

prisma.$on("info", (e) => {
  logger.error(e.message);
});

prisma.$on("warn", (e) => {
  logger.warn(e.message);
});
