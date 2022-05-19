import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { OnMedusaEntityEvent, Utils, eventEmitter } from "medusa-extender";

import { Product } from "./product.entity";

@EventSubscriber()
export default class ProductSubscriber
  implements EntitySubscriberInterface<Product>
{
  static attachTo(connection: Connection): void {
    Utils.attachOrReplaceEntitySubscriber(connection, ProductSubscriber);
  }

  public listenTo(): typeof Product {
    return Product;
  }

  /**
   * Relay the event to the handlers.
   * @param event Event to pass to the event handler
   */
  public async beforeInsert(event: InsertEvent<Product>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(Product),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    );
  }
}
