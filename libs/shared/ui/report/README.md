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
// app.modules.ts or core.modules.ts

import { ReportModule } from '@schaeffler/report';

@NgModule({
  ...
  imports: [
    ReportModule,
    ...
  ]
  ...
})
```

API of Report Component:

```typescript
  @Input() public title: string;
  @Input() public subtitle?: string;
  @Input() public htmlReport?: string;
  @Input() public jsonReportReport?: string;
  @Input() public type?: 'GENERIC' | 'GREASE';
  @Input() public downloadReport?: string;
  @Input() public errorMsg: string = 'Unfortunately an error occured. Please try again later.';
  @Input() public actionText: string = 'Retry';
  @Input() public reportSelector: string = 'body';
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-report
    *ngIf="result$ | ngrxPush as result; else loading"
    [title]="'Bearing ID (todo)'"
    [subtitle]="'Report ID (todo)'"
    [htmlReport]="result.htmlReportUrl"
    [jsonReport]="result.jsonReportUrl"
    [type]="'GREASE'"
    [downloadReport]="result.pdfReportUrl"
    [errorMsg]="translatedErrorMsg"
    [actionText]="translatedActionText"
    [reportSelector]=".content"
  >
  <div>Any content you want to show under the report in the card</div>
<schaeffler-report>
```

```typescript
// comp-xy.component.ts

public title = 'my title';
public img = 'my subtitle';
public htmlReport = 'url-to-html-report'
public jsonReport = 'url-to-json-report'
public downloadReport = 'url-to-pdf-report'
public errorMsg = 'some error message'
public actionText = 'some action text'
```

