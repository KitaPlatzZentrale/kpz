import { RequestHandler } from "express";

//  middleware to check if user is authenticated
export const isAuthenticated: RequestHandler<Request> = (req, res, next) => {
  const placeholder = true;
  if (!req.headers["x-api-key"]) {
    return res.status(401).json({ message: "No API key provided" });
  }
  if (req.headers["x-api-key"] !== process.env.AUTH_KEY) {
    return res.status(401).json({ message: "Wrong API key provided" });
  }
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
