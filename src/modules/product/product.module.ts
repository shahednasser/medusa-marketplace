import AttachProductSubscribersMiddleware from "./product.middleware";
import { Module } from "medusa-extender";
import { Product } from "./product.entity";
import ProductRepository from "./product.repository";
import { ProductService } from "./product.service";
import addStoreIdToProduct1645034402086 from "./product.migration";

@Module({
  imports: [
    Product,
    ProductRepository,
    ProductService,
    addStoreIdToProduct1645034402086,
    AttachProductSubscribersMiddleware,
  ],
})
export class ProductModule {}
