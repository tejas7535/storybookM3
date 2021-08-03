# frontend@schaeffler Report Documentation
## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

Also import the tailwind styles in your app
Example `styles.scss`


```scss
// styles.scss

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
/* You can add global styles to this file, and also import other style files */
```

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
  @Input() public displayReport: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg: string = 'Unfortunately an error occured. Please try again later.';
  @Input() public actionText: string = 'Retry';
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-report
    *ngIf="result$ | ngrxPush as result; else loading"
    [title]="'Bearing ID (todo)'"
    [subtitle]="'Report ID (todo)'"
    [displayReport]="result.htmlReportUrl"
    [downloadReport]="result.pdfReportUrl"
    [errorMsg]="translatedErrorMsg"
    [actionText]="translatedActionText"
  >
  <div>Any content you want to show under the report in the card</div>
<schaeffler-report>
```

```typescript
// comp-xy.component.ts

public title = 'my title';
public img = 'my subtitle';
public displayReport = 'url-to-html-repo.rt'
public downloadReport = 'url-to-pdf-repo.rt'
public errorMsg = 'some error message'
public actionText = 'some action text'
```

