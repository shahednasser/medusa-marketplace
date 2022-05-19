# Medusa Marketplace Plugin

Plugin to add a marketplace to Medusa. It is built using [Meduse Extender](https://github.com/adrien2p/medusa-extender).

This plugin requires `@medusajs/medusa` version > 1.3.0 and Medusa Extender version `1.6.5`.

## Features

1. Link users to stores.
2. Link products to stores.
3. Link orders to stores.
4. Create a store for every new user.
5. Fetch only the products in the user's store.
6. Allow registration of users.
7. Fetch only orders of the user's store.
8. Allow super admin to see all main orders.

## Installation

You first need to install Medusa Extender in your Medusa store, so please [follow the instructions to install it](https://github.com/adrien2p/medusa-extender#integration-in-an-existing-medusa-project).

After that, install this plugin with NPM:

```bash
npm i medusa-marketplace
```

Make sure that new migrations from the module can be run by adding the property `cliMigrationsDirs` into the exported object in `medusa-config.js`:

```js
module.exports = {
  projectConfig: {
    cliMigrationsDirs: ['node_modules/medusa-marketplace/dist/**/*.migration.js'],
    //existing options...
  }
};
```

Then, run the migrations after you've run Medusa's migrations:

```bash
./node_modules/.bin/medex m --run
```

You can then import each of the modules into `src/main.ts`:

```typescript
import { ProductModule, UserModule, StoreModule, OrderModule } from 'medusa-marketplace';
```

And add the modules into the array passed to `Medusa.load`:

```typescript
await new Medusa(rootDir, expressInstance).load([
  UserModule,
  ProductModule,
  StoreModule,
  OrderModule
]);
```
