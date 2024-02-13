import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for the token in the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Authentication token is required." });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    // Add the user's ID to the request if needed
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};
