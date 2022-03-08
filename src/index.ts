import { Module } from "medusa-extender";
import { ProductModule } from "./modules/product/product.module";
import { StoreModule } from "./modules/store/store.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [StoreModule, UserModule, ProductModule],
})
export class MarketplaceModule {}
