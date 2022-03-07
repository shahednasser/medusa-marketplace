import AttachProductSubscribersMiddleware from "./middlewares/product.middleware";
import { Module } from "medusa-extender";
import { Product } from "./entities/product.entity";
import ProductRepository from "./repositories/product.repository";
import { ProductService } from "./services/product.service";
import addStoreIdToProduct1645034402086 from "./migrations/product.migration";

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
