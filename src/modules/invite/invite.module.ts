import { AcceptInviteRouter } from "./invite.router";
import { AttachInviteSubscriberMiddleware } from "./inviteSubscriber.middleware";
import { Invite } from "./invite.entity";
import { InviteMigration1655123458263 } from "./1655123458263-invite.migration";
import { InviteRepository } from "./invite.repository";
import { InviteService } from "./invite.service";
import { Module } from "medusa-extender";

@Module({
  imports: [
    Invite,
    InviteRepository,
    InviteService,
    InviteMigration1655123458263,
    AttachInviteSubscriberMiddleware,
    AcceptInviteRouter,
  ],
})
export class InviteModule {}
