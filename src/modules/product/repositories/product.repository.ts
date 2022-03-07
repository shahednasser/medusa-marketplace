import { Repository as MedusaRepository, Utils } from "medusa-extender";

import { EntityRepository } from "typeorm";
import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { Product } from "../entities/product.entity";

@MedusaRepository({ override: MedusaProductRepository })
@EntityRepository(Product)
export default class ProductRepository extends Utils.repositoryMixin<
  Product,
  MedusaProductRepository
>(MedusaProductRepository) {}
