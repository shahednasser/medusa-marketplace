import {
  MEDUSA_RESOLVER_KEYS,
  MedusaAuthenticatedRequest,
  MedusaMiddleware,
  Utils as MedusaUtils,
  Middleware,
} from "medusa-extender";
import { NextFunction, Request, Response } from "express";

import { Connection } from "typeorm";
import ProductSubscriber from "../subscribers/product.subscriber";

@Middleware({
  requireAuth: true,
  routes: [{ method: "post", path: "/admin/products" }],
})
export default class AttachProductSubscribersMiddleware
  implements MedusaMiddleware
{
  public consume(
    req: MedusaAuthenticatedRequest | Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void> {
    const { connection } = req.scope.resolve(MEDUSA_RESOLVER_KEYS.manager) as {
      connection: Connection;
    };
    MedusaUtils.attachOrReplaceEntitySubscriber(connection, ProductSubscriber);
    return next();
  }
}
