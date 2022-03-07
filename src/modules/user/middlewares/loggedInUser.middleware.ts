import {
  MedusaAuthenticatedRequest,
  MedusaMiddleware,
  Middleware,
} from "medusa-extender";
import { NextFunction, Response } from "express";

import UserService from "../services/user.service";

@Middleware({ requireAuth: true, routes: [{ method: "all", path: "*" }] })
export class LoggedInUserMiddleware implements MedusaMiddleware {
  public async consume(
    req: MedusaAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (req.user && req.user.userId) {
      const userService = req.scope.resolve("userService") as UserService;
      const loggedInUser = await userService.retrieve(req.user.userId, {
        select: ["id", "store_id"],
      });

      req.scope.register({
        loggedInUser: {
          resolve: () => loggedInUser,
        },
      });
    }
    next();
  }
}
