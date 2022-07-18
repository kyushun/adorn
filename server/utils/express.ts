// https://neos21.net/blog/2020/06/14-02.html

import express from "express";

interface PromiseRequestHandler {
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<unknown>;
}

export const asyncHandler = (
  fn: PromiseRequestHandler
): express.RequestHandler => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<unknown> =>
    fn(req, res, next).catch((error: unknown) => {
      next(error || "An unexpected error occurred.");
    });
};
