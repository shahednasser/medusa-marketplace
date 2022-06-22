import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import {
  Utils as MedusaUtils,
  OnMedusaEntityEvent,
  eventEmitter,
} from "medusa-extender";

import { Invite } from "./invite.entity";

@EventSubscriber()
export default class InviteSubscriber
  implements EntitySubscriberInterface<Invite>
{
  static attachTo(connection: Connection): void {
    MedusaUtils.attachOrReplaceEntitySubscriber(connection, InviteSubscriber);
  }

  public listenTo(): typeof Invite {
    return Invite;
  }

  /**
   * Relay the event to the handlers.
   * @param event Event to pass to the event handler
   */
  public async beforeInsert(event: InsertEvent<Invite>): Promise<void> {
    return await eventEmitter.emitAsync(
      OnMedusaEntityEvent.Before.InsertEvent(Invite),
      {
        event,
        transactionalEntityManager: event.manager,
      }
    );
  }
}
