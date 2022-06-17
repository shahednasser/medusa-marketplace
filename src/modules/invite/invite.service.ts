import { ConfigModule } from "@medusajs/medusa/dist/types/global";
import { EntityManager } from "typeorm";
import { EventBusService } from "@medusajs/medusa";
import { Invite } from "./invite.entity";
import { InviteRepository } from "./invite.repository";
import { default as MedusaInviteService } from "@medusajs/medusa/dist/services/invite";
import { Service } from "medusa-extender";
import { User } from "../user/user.entity";
import UserRepository from "../user/user.repository";
import UserService from "../user/user.service";

type InviteServiceProps = {
  manager: EntityManager;
  userService: UserService;
  userRepository: UserRepository;
  eventBusService: EventBusService;
  loggedInUser?: User;
  inviteRepository: InviteRepository;
};

@Service({ scope: "SCOPED", override: MedusaInviteService })
export class InviteService extends MedusaInviteService {
  static readonly resolutionKey = "inviteService";

  private readonly manager: EntityManager;
  private readonly container: InviteServiceProps;
  private readonly inviteRepository: InviteRepository;

  constructor(container: InviteServiceProps, configModule: ConfigModule) {
    super(container, configModule);

    this.manager = container.manager;
    this.container = container;
    this.inviteRepository = container.inviteRepository;
  }

  async retrieve(invite_id: string): Promise<Invite | null> {
    return await this.atomicPhase_(async (m) => {
      const inviteRepo: InviteRepository = m.getCustomRepository(
        this.inviteRepository
      );

      return await inviteRepo.findOne({ where: { id: invite_id } });
    });
  }

  buildQuery_(selector, config = {}): object {
    if (
      Object.keys(this.container).includes("loggedInUser") &&
      this.container.loggedInUser.store_id
    ) {
      selector["store_id"] = this.container.loggedInUser.store_id;
    }

    return super.buildQuery_(selector, config);
  }
}
