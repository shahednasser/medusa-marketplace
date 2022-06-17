import {
  EntityEventType,
  MedusaEventHandlerParams,
  OnMedusaEntityEvent,
  Service,
} from "medusa-extender";

import { CurrencyRepository } from "@medusajs/medusa/dist/repositories/currency";
import { EntityManager } from "typeorm";
import EventBusService from "@medusajs/medusa/dist/services/event-bus";
import { Invite } from "../invite/invite.entity";
import { StoreService as MedusaStoreService } from "@medusajs/medusa/dist/services";
import { Store } from "./store.entity";
import StoreRepository from "./store.repository";
import { User } from "../user/user.entity";

interface ConstructorParams {
  loggedInUser?: User;
  manager: EntityManager;
  storeRepository: typeof StoreRepository;
  currencyRepository: typeof CurrencyRepository;
  eventBusService: EventBusService;
}

@Service({ override: MedusaStoreService, scope: "SCOPED" })
export default class StoreService extends MedusaStoreService {
  private readonly manager: EntityManager;
  private readonly storeRepository: typeof StoreRepository;

  constructor(private readonly container: ConstructorParams) {
    super(container);
    this.manager = container.manager;
    this.storeRepository = container.storeRepository;
  }

  withTransaction(transactionManager: EntityManager): StoreService {
    if (!transactionManager) {
      return this;
    }

    const cloned = new StoreService({
      ...this.container,
      manager: transactionManager,
    });

    cloned.transactionManager_ = transactionManager;

    return cloned;
  }

  @OnMedusaEntityEvent.Before.Insert(User, { async: true })
  public async createStoreForNewUser(
    params: MedusaEventHandlerParams<User, "Insert">
  ): Promise<EntityEventType<User, "Insert">> {
    const { event } = params;
    let store_id = Object.keys(this.container).includes("loggedInUser")
      ? this.container.loggedInUser.store_id
      : null;
    if (!store_id) {
      const createdStore = await this.withTransaction(
        event.manager
      ).createForUser(event.entity);
      if (!!createdStore) {
        store_id = createdStore.id;
      }
    }

    event.entity.store_id = store_id;

    return event;
  }

  @OnMedusaEntityEvent.Before.Insert(Invite, { async: true })
  public async addStoreToInvite(
    params: MedusaEventHandlerParams<Invite, "Insert">
  ): Promise<EntityEventType<Invite, "Insert">> {
    const { event } = params;
    const store_id = this.container.loggedInUser.store_id;

    if (!event.entity.store_id && store_id) {
      event.entity.store_id = store_id;
    }

    return event;
  }

  /**
   * Create a store for a particular user. It mainly used from the event BeforeInsert to create a store
   * for the user that is being inserting.
   * @param user
   */
  public async createForUser(user: User): Promise<Store | void> {
    if (user.store_id) {
      return;
    }
    const storeRepo = this.manager.getCustomRepository(this.storeRepository);
    const store = storeRepo.create() as Store;
    return storeRepo.save(store);
  }

  /**
   * Return the store that belongs to the authenticated user.
   * @param relations
   */
  public async retrieve(relations: string[] = []) {
    if (!Object.keys(this.container).includes("loggedInUser")) {
      return super.retrieve(relations);
    }

    const storeRepo = this.manager.getCustomRepository(this.storeRepository);
    const store = await storeRepo.findOne({
      relations,
      join: { alias: "store", innerJoin: { members: "store.members" } },
      where: (qb) => {
        qb.where("members.id = :memberId", {
          memberId: this.container.loggedInUser.id,
        });
      },
    });

    if (!store) {
      throw new Error("Unable to find the user store");
    }

    return store;
  }
}
