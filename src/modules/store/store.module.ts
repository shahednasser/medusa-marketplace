import { Module } from "medusa-extender";
import { Store } from "./store.entity";
import StoreRepository from "./store.repository";
import StoreService from "./store.service";

@Module({
  imports: [Store, StoreRepository, StoreService],
})
export class StoreModule {}
