# frontend@schaeffler Report Documentation

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
@import 'libs/shared/ui/styles/src/lib/scss/material-theme';

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
// app.modules.ts or core.modules.ts

import { ResultReportComponent } from '@schaeffler/result-report';

@NgModule({
  ...
  imports: [
    ResultReportComponent,
    ...
  ]
  ...
})
```

API of Result Report Component:

```typescript
  @Input() public reportInputs: CalculationResultReportInput[] | undefined;
  @Input() public messages!: ReportMessages;
```

Use like:

```html
<!-- comp-xy.component.html -->
<schaeffler-result-report
          class="flex h-full flex-row justify-between"
          [reportInputs]="
            calculationResultFacade.calculationReportInput$ | ngrxPush
          "
          [messages]="messages"
        >
<ng-container report-header-content>additional header content</ng-container>
<ng-container report-main-content>report main content</ng-container>
<ng-container report-right-sidebar>report main content</ng-container>
<ng-container report-footer-content> eport footer content</ng-container>
</schaeffler-result-report>
```

