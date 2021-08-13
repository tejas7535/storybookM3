# frontend@schaeffler Loading Spinner Documentation

Legal pages to be added to a project. available in English and German. The routes are exposed 

## Disclaimer
This lib depends on the [tailwind](https://www.npmjs.com/package/tailwindcss), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [frontend-schaeffler repo](https://github.com/Schaeffler-Group/frontend-schaeffler/blob/master/tailwind.config.js)

Also import the tailwind styles in your app
Example `styles.scss`
``` scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

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
