import { AttachUserSubscriberMiddleware } from "./middlewares/userSubscriber.middleware";
import { LoggedInUserMiddleware } from "./middlewares/loggedInUser.middleware";
import { Module } from "medusa-extender";
import { User } from "./entities/user.entity";
import UserRepository from "./repositories/user.repository";
import { UserRouter } from "./routers/user.router";
import UserService from "./services/user.service";
import addStoreIdToUser1644946220401 from "./migrations/user.migration";

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
