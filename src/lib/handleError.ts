import { NextFunction, Request, Response } from "express";

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("** ОШИБКА СЕРВЕРА: " + err.message);
  res.status(500).send("Произошла ошибка сервера, приносим свои извинения.");
};
