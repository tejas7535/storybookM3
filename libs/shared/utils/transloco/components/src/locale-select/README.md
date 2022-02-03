# Integrate transloco-related UI components

## Locale-Select

> Based on transloco locale plugin, see [docs](https://ngneat.github.io/transloco/docs/plugins/locale)

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

```css
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

### Import the Transloco Base Module

```ts
// app.module.ts or core.module.ts

import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  ...
    imports: [
      SharedTranslocoModule.forRoot(
        ...
      ),
      ...
    ]
...
})
```

### Import the Locale-Select Component Module

```ts
// parent component module

import { LocaleSelectModule } from '@schaeffler/transloco/components';

import { ParentComponent } from './parent.component';

@NgModule({
  ...
  imports: [
    LocaleSelectModule,
    ...
  ],
  declarations: [
    ParentComponent
  ],
  ...
})
```

### Embed the Locale-Select Component (example)

In the parent component:

> IMPORTANT: Make sure to use the correct type for the `availableLocales` and `defaultLocale`!

```ts
import { Locale } from '@schaeffler/transloco/components';

const AVAILABLE_LOCALES: Locale[] = [
  {
    id: 'de-DE',
    label: 'Deutsch (Deutschland)',
  },
  {
    id: 'en-US',
    label: 'English (United States)',
  },
];

const DEFAULT_LOCALE: Locale = AVAILABLE_LOCALES[0];

@Component({
  selector: 'app-parent-component',
  templateUrl: './parent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentComponent {
  availableLocales = AVAILABLE_LOCALES;
  defaultLocale = DEFAULT_LOCALE;
}
})
```

```html
<!--  default implementation  -->
<schaeffler-locale-select
  [availableLocales]="availableLocales"
  [defaultLocale]="defaultLocale"
></schaeffler-locale-select>

<!--  refresh page on locale change  -->
<schaeffler-locale-select
  [reloadOnLocaleChange]="true"
  [availableLocales]="availableLocales"
  [defaultLocale]="defaultLocale"
></schaeffler-locale-select>

<!--  set custom texts  -->
<!--  make sure to provide the necessary translations  -->
<schaeffler-locale-select
  [availableLocales]="availableLocales"
  [defaultLocale]="defaultLocale"
  hintText="custom.translation.key.for.hint"
  tooltipText="custom.translation.key.for.tooltip"
></schaeffler-locale-select>
```

### Component API

| Name                   | Description                                                                                          |
| -----------------------| -----------------------------------------------------------------------------------------------------|
| reloadOnLocaleChange   | (optional) (default: false) Whether the page should be reloaded when changing the locale selection   |
| availableLocales       | (optional) (default: see example) The list of selectable options for locales                         |
| defaultLocale          | (optional) (default: see example) The default selected local                                         |
| hintText               | (optional) Change the text of the select input hint*                                                 |
| tooltipText            | (optional) Change the text of the tooltip*                                                           |

> *applies to all text props:  
> Use a translation key and make sure to provide the necessary translation.  
> The Lib comes with a default translation.

### Component i18n

The component comes with translations for the following locales:

* de (german 🇩🇪)
* en (english 🇬🇧)
* es (spanish 🇪🇸)
* fr (french 🇫🇷)
* ru (russian 🇷🇺)
* zh (chinese 🇨🇳)

## Localization API

The transloco locale plugin provides localization API provided by pipes or from a service.  
For further information see the [docs](https://ngneat.github.io/transloco/docs/plugins/locale/#localization-pipes)

### Pipes (Examples)

* `{{ value }} | translocoDecimal`  --> see [docs](https://ngneat.github.io/transloco/docs/plugins/locale/#decimal-pipe)
* `{{ value }} | translocoDate`  --> see [docs](https://ngneat.github.io/transloco/docs/plugins/locale/#date-pipe)

### Service
TranslocoLocaleService  --> see [docs](https://ngneat.github.io/transloco/docs/plugins/locale/#service-api)
