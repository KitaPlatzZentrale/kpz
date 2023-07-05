import { RequestHandler } from "express";

//  middleware to check if user is authenticated
export const isAuthenticated: RequestHandler<Request> = (req, res, next) => {
  const placeholder = true;
  if (placeholder) {
    return next();
  }
  return res.status(401).send("Unauthorized");
};

export const isAuthorized: RequestHandler<Request> = (req, res, next) => {
  const isAuthorizedUser = true;

  if (isAuthorizedUser) {
    return next();
  }

  return res.status(403).send("Forbidden");
};
