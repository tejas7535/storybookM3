# frontend@schaeffler View Toggle Documentation

## Usage

### Prerequisites
This lib depends on [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:
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
Import into your project like:

```ts
// *.module.ts
import { ViewToggleModule } from '@schaeffler/view-toggle';

@NgModule({
  ...
    imports: [
  ViewToggleModule,
  ...
]
...
})
```

Use like:

```typescript
// comp-xy.component.html

import { ViewToggle } from '@schaeffler/view-toggle';

public views: ViewToggle[] = [
  {
    id: 0,
    // id is used to identify the active view for styling
    title: 'title view1'
  },
  {
    id: 1,
    title: 'title view2'
  },
  {
    id: 2,
    title: 'title view3',
    // disables click on view
    disabled: true,
  },
]

public selectionChange(item: ViewToggle){
  // execute logic based on selectedItem
}

```

```html
<!-- comp-xy.component.html -->
<schaeffler-view-toggle [views]="views" (selectionChange)="selectionChange($event)">
</schaeffler-view-toggle>

<!--or -->

<!-- Display border bottom of the component -->
<schaeffler-view-toggle [views]="views" [displayBorderBottom]="true">
</schaeffler-view-toggle>
```

### API

| Name                                            | Description                                                |
| ------------------------------------------------| -----------------------------------------------------------|
| views: ViewToggle[]                             | Array of toggle views                                      |
| displayBorderBottom: boolean                    | (optional) Display border bottom, is false on default      |
| selectionChange: function(item: ViewToggle)     | Output Event, passing the selection as parameter           |


###### `ViewToggle`

```typescript
{
  id: number;
  title: string;
  disabled: boolean;
}
```