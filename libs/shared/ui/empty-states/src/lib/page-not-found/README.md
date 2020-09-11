# frontend@schaeffler Page Not Found

Import into your project like:

```typescript
// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { SharedTranslocoModule } from '@schaeffler/transloco';

export enum RoutePath {
  BasePath = '',
  ForbiddenPath = 'forbidden',
}

export const appRoutePaths: Routes = [
  {
    ...
  },
  {
    path: '**',
    loadChildren: () =>
      import('@schaeffler/empty-states').then(
        (m) => m.PageNotFoundModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutePaths, {
      useHash: true,
    }),
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en',
      'en',
      true
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

```
