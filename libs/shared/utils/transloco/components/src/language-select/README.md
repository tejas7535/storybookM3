# Integrate transloco-related UI components

## Language-Select

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

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

### Import the Transloco Base Module with the needed settings

> IMPORTANT: Make sure to use the correct type for the available languages!

```ts
// app.module.ts or core.module.ts (example)

import { LangDefinition } from '@ngneat/transloco/lib/types';

import { SharedTranslocoModule } from '@schaeffler/transloco';

const AVAILABLE_LANGUAGE_DE: LangDefinition = {
  id: 'de',
  label: 'Deutsch',
};

const AVAILABLE_LANGUAGE_EN: LangDefinition = {
  id: 'en',
  label: 'English',
};

const AVAILABLE_LANGUAGES: LangDefinition[] = [
  AVAILABLE_LANGUAGE_DE,
  AVAILABLE_LANGUAGE_EN,
];

const FALLBACK_LANGUAGE: LangDefinition = AVAILABLE_LANGUAGE_EN;



@NgModule({
  ...
    imports: [
  SharedTranslocoModule.forRoot(
    environment.production,
    AVAILABLE_LANGUAGES,
    undefined, // default -> undefined would lead to browser detection
    FALLBACK_LANGUAGE.id,
    true,
    !environment.localDev,
    i18nChecksumsJson
  ),
  ...
]
...
})
```

### Import the Language-Select Component Module

```ts
// parent component module

import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { ParentComponent } from './parent.component';

@NgModule({
  ...
    imports: [
  LanguageSelectModule,
  ...
],
  declarations: [
  ParentComponent
]
...
})
```

### Embed the Language-Select Component (example)

In the parent component:

```html
<!--  default implementation  -->
<schaeffler-language-select></schaeffler-language-select>

<!--  refresh page on language change  -->
<schaeffler-language-select [reloadOnLanguageChange]="true"></schaeffler-language-select>
```

### Component API

| Name                   | Description                                                                                          |
| -----------------------| -----------------------------------------------------------------------------------------------------|
| reloadOnLanguageChange | (optional) (default: false) Whether the page should be reloaded when changing the language selection |

### Component i18n

The component comes with translations for the following languages:

* de (german 🇩🇪)
* en (english 🇬🇧)
* es (spanish 🇪🇸)
* fr (french 🇫🇷)
* ru (russian 🇷🇺)
* zh (chinese 🇨🇳)
