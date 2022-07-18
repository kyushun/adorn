import log4js from "log4js";

log4js.configure({
  appenders: {
    console: {
      type: "console",
    },
    access: {
      type: "dateFile",
      filename: "logs/access.log",
      pattern: "-yyyy-MM-dd",
    },
    express: {
      type: "dateFile",
      filename: "logs/express.log",
      pattern: "-yyyy-MM-dd",
    },
    prisma: {
      type: "dateFile",
      filename: "logs/prisma.log",
      pattern: "-yyyy-MM-dd",
    },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: process.env.LOG_LEVEL || "warn",
    },
    access: {
      appenders: ["console", "access"],
      level: process.env.LOG_LEVEL || "warn",
    },
    express: {
      appenders: ["console", "express"],
      level: process.env.LOG_LEVEL || "warn",
    },
    prisma: {
      appenders: ["console", "prisma"],
      level: process.env.LOG_LEVEL || "warn",
    },
  },
});

export const accessLogger = log4js.getLogger("access");

export const expressLogger = log4js.getLogger("express");

export const prismaLogger = log4js.getLogger("prisma");
