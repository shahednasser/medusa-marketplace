import { Module } from "medusa-extender";
import { Store } from "./entities/store.entity";
import StoreRepository from "./repositories/store.repository";
import StoreService from "./services/store.service";

@Module({
  imports: [Store, StoreRepository, StoreService],
})
export class StoreModule {}
