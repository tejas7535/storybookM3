# frontend@schaeffler-tailwind Subheader Documentation

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons]()[](https://fontsource.org/docs/icons/material-icons). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

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
// app.module.ts / core.module.ts or feature.modile.ts

import { SubheaderModule } from '@schaeffler/subheader';

@NgModule({
  ...
  imports: [
    SubheaderModule,
    ...
  ]
  ...
})
```

API of Subheader Component:

```typescript
  @Input() showBackButton: boolean; // true on default, can be disabled if no back button is needed

  @Input() breadcrumbs: Breadcrumb[] // list of breadcrumbs for schaeffler-breadcrumbs. If this input is provided, the backButton automatically navigates to second to last breadcrumb 

  @Input() subheaderTitle = '' // title of the subheader

  @Input() hideLine: boolean // false on default, optinal hiding of line under the subheader

  @Input() truncateBreadcrumbsAfter: number // 0 on default, optinal, adds a truncation of the breadcrumbs items at a certain point, counted from the top, see breadcrumbs component

  @Output() backButtonClicked // only is emitted if there are no breadcrumbs as input or breadcrumb.length < 2
```

Use like:

```html
<!-- comp-xy.component.html -->
<schaeffler-subheader title="Search Results | 69 Findings" [breadcrumbs]="breadcrumbs">  
  <ng-container subheaderTitleContent>
    place your own custom addtional title content here
  </ng-container>
  <ng-container subheaderInlineContent>
    place content here
  <ng-container>
  <ng-container subheaderBlockContent>
    place content here
  <ng-container>
</schaeffler-subheader>
```

```typescript
// comp-xy.component.ts
  import { Breadcrumb } from '@schaeffler/breadcrumbs';

  public breadcrumbs: BreadCrumbs[] = [
    {label: 'Label', url: '/page', queryParams: {queryParam: 'value'}}
    {label: 'Label2', url: '/page2', queryParams: {queryParam: 'value2'}}
  ]
```
