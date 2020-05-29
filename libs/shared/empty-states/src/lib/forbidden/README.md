# frontend@schaeffler Forbidden

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

Pass an action to the `Forbidden` Page. This will show an additional button `request access`, which opens a predefined email:

```typescript
// app-routing.module.ts
...

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
    data: { 
        action: 'href email opener' // see https://wiki.selfhtml.org/wiki/HTML/Tutorials/Links/Verweise_auf_Mailadressen for further information
    }
  },
  ...
];
...

```