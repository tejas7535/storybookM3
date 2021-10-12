# frontend@schaeffler Maintenance 

This lib depends on `tailwind`, which has to be included in your app.

```css
/* styles.scss */

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import into your project like:

```typescript
// app.module.ts

import { MaintenanceModule } from '@schaeffler/empty-states';

import { environment } from '../environments/environment';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  imports: [
    MaintenanceModule,
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en',
      'en',
      true
    ),
    ...
  ],
})
export class AppRoutingModule {}
```

Use in your template with:

```html
<div>
    <schaeffler-maintenance></schaeffler-maintenance>
</div>
```

The component selects a default `title` and `subtitle` which are internationalized. There are translations for `DE` and `EN` available.

You can also override the default behavior and define a custom `title` and `subtitle` for the component:
```html
<div >
    <schaeffler-maintenance
    title="Application currently under maintenance"
    subtitle="We will be back at 9:30 am GMT/UTC+1. Thanks for your patience."
    ></schaeffler-maintenance>
</div>
```