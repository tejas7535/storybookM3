# frontend@schaeffler Rich Tooltip Documentation

The element is meant to present information in the form of tooltip with custom content for instance, links, buttons, icons etc.


## Usage

### Prerequisites

This lib depends on [Tailwind](https://tailwindcss.com/docs). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
***************************************************************************************************
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

```ts
// app.modules.ts or core.modules.ts

import { RichTooltipComponent } from '@schaeffler/rich-tooltip';

@NgModule({
  ...
    imports: [
  RichTooltipComponent,
  ...
]
...
})
```

```ts
// some-standalone.component.ts 

import { RichTooltipComponent } from '@schaeffler/rich-tooltip';

@Component({
  ...
    imports: [
  RichTooltipComponent,
  ...
]
...
})
```


```html
<div class="flex ml-1 flex-shrink-0">
    <p>Hover over the icon to see tooltip</p>
    <mat-icon
    cdkOverlayOrigin
    #infoIcon="cdkOverlayOrigin"
    [inline]="true"
    color="inherit"
    class="cursor-help ml-3"
    >info_outline</mat-icon
    >
</div>

<schaeffler-rich-tooltip
    [tooltipOrigin]="infoIcon"
    [tooltipShowDelay]="tooltipShowDelayValue"
    [tooltipHideDelay]="tooltipHideDelayValue"
>
    {{ 'Some Rich tooltip information Text' }}
    <a class="hover:cursor-pointer hover:underline ml-1"
    >{{ 'Read More'
    }}<mat-icon [inline]="true" class="ml-0.5 !h-3"
        >open_in_new</mat-icon
    ></a
    >
</schaeffler-rich-tooltip>

```

