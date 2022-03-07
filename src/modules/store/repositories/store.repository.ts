import { Repository as MedusaRepository, Utils } from "medusa-extender";

import { EntityRepository } from "typeorm";
import { StoreRepository as MedusaStoreRepository } from "@medusajs/medusa/dist/repositories/store";
import { Store } from "../entities/store.entity";

@MedusaRepository({ override: MedusaStoreRepository })
@EntityRepository(Store)
export default class StoreRepository extends Utils.repositoryMixin<
  Store,
  MedusaStoreRepository
>(MedusaStoreRepository) {}
