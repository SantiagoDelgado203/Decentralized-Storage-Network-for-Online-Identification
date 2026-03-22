import { type Request, type Response, type NextFunction } from 'express'
import jwt from "jsonwebtoken";

export function authMiddleware(

    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;
    if (!token) {
        console.log("Middleware: No token")
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, type: "user" | "verifier" };

        (req as any).user = decoded;  // attach to request safely

        next();
    } catch {
        console.log("Middleware: Invalid Token")
        return res.status(401).json({ error: "Invalid token" });
    }
}

export function authorizeRole(requiredType: "user" | "verifier") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (user.type !== requiredType) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}