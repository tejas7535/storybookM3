# frontend@schaeffler Forbidden

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```css
/* styles.scss */

@import '@schaeffler/styles/src';
```

Import into your project like:

```typescript
// app-routing.module.ts

import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../environments/environment';

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
      import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  }
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(appRoutePaths, {
      useHash: true
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