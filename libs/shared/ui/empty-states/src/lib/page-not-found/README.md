# frontend@schaeffler Page Not Found

Import into your project like:

```typescript
// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export enum RoutePath {
  BasePath = '',
  ForbiddenPath = 'forbidden',
}

export const appRoutePaths: Routes = [
  {
    ...
  },
  {
    path: RoutePath.ForbiddenPath,
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then((m) => m.ForbiddenModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/shared/empty-states').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      useHash: true,
      initialNavigation: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```
