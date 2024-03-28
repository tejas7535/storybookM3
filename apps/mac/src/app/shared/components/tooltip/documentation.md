# frontend@schaeffler Settings Sidebar Documentation

[Angular Material Documentation](https://material.angular.io/components/sidenav/overview)

Import into your project like:

```typescript
// app.modules.ts

import { Tooltip } from '../../shared/components/tooltip/tooltip.module';

@NgModule({
  ...
  imports: [
    TooltipModule,
    ...
  ]
  ...
})
```

API:

```typescript
  @Input() content: string; // content that is shown within the tooltip
  @Input() color: string; // color of the icon button, could be e.g. primary
  @Input() manualcolor: string; // manual custom hex color of the icon button, could be e.g. #1d9bb2
  @Input() icon: string; // icon of the icon buttonn, could be e.g. icon-toast-information
  @Input() materialIcon: string; // if it is a materialIcon, false by default
```

Use like:

```html
<!-- parent.component.html -->
<ltp-tooltip [content]="This is a tooltip | translate" color="primary" icon="icon-toast-information"></ltp-tooltip>
```
