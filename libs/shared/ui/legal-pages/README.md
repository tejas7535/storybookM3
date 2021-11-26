# frontend@schaeffler Loading Spinner Documentation

Legal pages to be added to a project. available in English and German. The routes are exposed 

## Usage

### Prerequisites

As this lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs), it is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 * and material icons, see https://fonts.google.com/icons
 */
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';

/*
 * further / custom components
 */
...

/***************************************************************************************************
 * UTILITIES
 */

/*
 * TailwindCSS, utility-first css framework
 * see https://tailwindcss.com/docs
 */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/*
 * further / custom utilities
 */
...

/***************************************************************************************************
 * OVERRIDES
 */ 
...
```

### Import the Module

```typescript
// app.module.ts
import { LegalRoute } from '@schaeffler/legal-pages';

export const appRoutePaths = [
  {
    path: LegalRoute,
    loadChildren: async () =>
      import('@schaeffler/legal-pages').then((m) => m.LegalModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  providers: [
    ...
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
  ],
  ...
})
export class AppRoutingModule {}

```

After importing, make sure that you provide links in a place of your choosing to paths given in:
```typescript
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
```

## Running unit tests

Run `nx test shared-ui-legal-pages` to execute the unit tests.
