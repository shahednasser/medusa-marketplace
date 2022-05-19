import { AttachUserSubscriberMiddleware } from "./userSubscriber.middleware";
import { LoggedInUserMiddleware } from "./loggedInUser.middleware";
import { Module } from "medusa-extender";
import { User } from "./user.entity";
import UserRepository from "./user.repository";
import { UserRouter } from "./user.router";
import UserService from "./user.service";
import addStoreIdToUser1644946220401 from "./user.migration";

@Module({
  imports: [
    User,
    UserService,
    UserRepository,
    addStoreIdToUser1644946220401,
    UserRouter,
    LoggedInUserMiddleware,
    AttachUserSubscriberMiddleware,
  ],
})
export class UserModule {}
