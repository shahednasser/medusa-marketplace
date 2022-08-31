# Medusa Marketplace Plugin

Plugin to add a marketplace to Medusa. It is built using [Meduse Extender](https://github.com/adrien2p/medusa-extender).

> This plugin is currently only compatible witb Medusa v1.3.3 and Medusa Extender v1.7.2

## Features

1. Link users to stores.
2. Link products to stores.
3. Link orders to stores.
4. Create a store for every new user.
5. Fetch only the products in the user's store.
6. Allow registration of users.
7. Fetch only orders of the user's store.
8. Allow super admin to see all main orders.
9. Allow users to add new users to their team
10. Allow users to send invites to new users
11. Added a minimal implementation of ACL

## Installation

You first need to install Medusa Extender in your Medusa store, so please [follow the instructions to install it](https://github.com/adrien2p/medusa-extender#existing-medusa-project).

After that, install this plugin with NPM:

```bash
npm i medusa-marketplace
```

Make sure that new migrations from the module can be run by adding the property `cliMigrationsDirs` into the exported object in `medusa-config.js`:

```js
module.exports = {
  projectConfig: {
    cli_migration_dirs: ['node_modules/medusa-marketplace/dist/**/*.migration.js'],
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
import { ProductModule, UserModule, StoreModule, OrderModule, InviteModule, RoleModule, PermissionModule } from 'medusa-marketplace';
```

And add the modules into the array passed to `Medusa.load`:

```typescript
await new Medusa(__dirname + '/../', expressInstance).load([
  UserModule,
  ProductModule,
  StoreModule,
  OrderModule,
  InviteModule,
  RoleModule,
  PermissionModule
]);
```

## Using Permission Guard

Version `1.3.0` introduces a permission guard that allows you to restrict routes based on a specific permission.

To use the permission guard, add it to a router. For example:

```typescript
import { Router } from 'medusa-extender';
import listProductsHandler from '@medusajs/medusa/dist/api/routes/admin/products/list-products';
import { permissionGuard } from 'medusa-marketplace';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';

@Router({
    routes: [
        {
            requiredAuth: true,
            path: '/admin/products',
            method: 'get',
            handlers: [
              permissionGuard([
                {path: "/admin/products"}
              ]),
              wrapHandler(listProductsHandler)
            ],
        },
    ],
})
export class ProductsRouter {}
```

This tests that a user has the permission `{path: "/admin/products"}`. This means that the user must have at least 1 permission with the `metadata` field having the value `{path: "/admin/products"}`.

You can pass more than one permission.
