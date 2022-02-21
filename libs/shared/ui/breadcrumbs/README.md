# frontend@schaeffler Breadcrumbs Documentation

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

Import into your project like:

```typescript
// *.module.ts

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

@NgModule({
  ...
  imports: [
    BreadcrumbsModule,
    ...
  ]
  ...
})
```

Use like:

```typescript
// comp-xy.component.ts

import { Breadcrumb } from '@schaeffler/breadcrumbs';

public breadcrumbs: Breadcrumb[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Search',
    url: '/search',
    tooltip: 'Search everything from A to B'
  },
  {
    label: 'Results',
    url: '/results',
    queryParams: {
        foo: 'bar'
    }
  },
  {
    label: 'Detail Bar',
    // when you don't provide a url, the breadcrumb item is not linked, which is usually intended for the last item 
  },
];
```

```html
<!-- comp-xy.component.html -->

<!--Show regular breadcrumbs items-->
<schaeffler-breadcrumbs
  [breadcrumbs]="breadcrumbs"
></schaeffler-breadcrumbs>

<!-- or -->

<!--Add a truncation of the breadcrumbs items at a certain point, counted from the top-->
<schaeffler-breadcrumbs
  [breadcrumbs]="breadcrumbs"
  [truncateAfter]="2"
></schaeffler-breadcrumbs>

```

### API

| Name                      | Description                                                                                   |
| --------------------------| ----------------------------------------------------------------------------------------------|
| breadcrumbs: Breadcrumb[] | Array of breadcrumbs items                                                                    |
| truncateAfter: number     | (optional) Add a truncation of the breadcrumbs items at a certain point, counted from the top |


#### Interfaces

###### `Breadcrumb`

```typescript
{
  label: string;
  url?: string;
  queryParams?: Params; //angular router URL parameters
  tooltip?: string;
}
```
