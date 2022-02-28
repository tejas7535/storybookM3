# frontend@schaeffler Legal Pages Documentation

Legal pages to be added to a project. available in English and German. The routes are exposed 

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 */
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

export function DynamicTermsOfUse(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('key.to.translation');
}

export function DynamicPurpose(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('key.to.translation');
}

export function DynamicDataPrivacy(translocoService: TranslocoService) {
  return translocoService.selectTranslateObject('key.to.translation');
}

@NgModule({
  imports: [RouterModule.forRoot(appRoutePaths)],
  providers: [
    ...
    // optional responsible person & company, shown imprint and data privacy
    {
      provide: PERSON_RESPONSIBLE,
      useValue: responsiblePerson,
    },
    // optional terms of use
    {
      provide: TERMS_OF_USE,
      useValue: DynamicTermsOfUse  
    },
    // optional purpose, shown in data privacy section 3
    {
      provide: PURPOSE
      useValue: DynamicPurpose
    },
    // optional custom data privacy, shown in data privacy section
    {
      provide: CUSTOM_DATA_PRIVACY,
      useValue: DynamicDataPrivacy
    }
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
