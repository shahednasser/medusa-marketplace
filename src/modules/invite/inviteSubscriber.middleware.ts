import {
  MEDUSA_RESOLVER_KEYS,
  MedusaAuthenticatedRequest,
  MedusaMiddleware,
  Utils as MedusaUtils,
  Middleware,
} from "medusa-extender";
import { NextFunction, Response } from "express";

import { Connection } from "typeorm";
import InviteSubscriber from "./invite.subscriber";

@Middleware({
  requireAuth: true,
  routes: [{ method: "post", path: "/admin/invites*" }],
})
export class AttachInviteSubscriberMiddleware implements MedusaMiddleware {
  public async consume(
    req: MedusaAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { connection } = req.scope.resolve(MEDUSA_RESOLVER_KEYS.manager) as {
      connection: Connection;
    };
    InviteSubscriber.attachTo(connection);
    return next();
  }
}
