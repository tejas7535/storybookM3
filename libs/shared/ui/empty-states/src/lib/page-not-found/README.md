# frontend@schaeffler Page Not Found

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
    HttpClientModule,
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
