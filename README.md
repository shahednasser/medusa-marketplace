# Medusa Marketplace Plugin

Plugin to add a marketplace to Medusa. It is built using [Meduse Extender](https://github.com/adrien2p/medusa-extender).

## Features

1. Link users to stores.
2. Link products to stores.
3. Create a store for every new user.
4. Fetch only the products in the user's store.
5. Allow registration of users.

## Installation

You first need to install Medusa Extender in your Medusa store, so please [follow the instructions to install it](https://github.com/adrien2p/medusa-extender#integration-in-an-existing-medusa-project).

After that, install this plugin with NPM:

```bash
npm i medusa-marketplace
```

You can then import each of the modules into `src/main.ts`:

```typescript
import { ProductModule, UserModule, StoreModule } from 'medusa-marketplace';
```

And add the modules into the array passed to `Medusa.load`:

```typescript
await new Medusa(rootDir, expressInstance).load([
  UserModule,
  ProductModule,
  StoreModule
]);
```
