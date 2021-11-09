# frontend@schaeffler Shared Transloco Modules

Integrate [Transloco](https://ngneat.github.io/transloco) i18n library in seconds.
This library provides Transloco modules for usage in apps and as mock in tests as well as useful standardized UI components.

## How to use transloco in your app

Import `SharedTranslocoModule` into your main app.module.ts:

```ts
import { environment } from '../environments/environment';
.
.
.
imports: [
    SharedTranslocoModule.forRoot(environment.production, ['de', 'en'], undefined, 'en', true)
]
```

The first parameter represents whether Transloco should be imported for production with AOT.  
The second parameter represents the available languages in your application.  
The third parameter defines the default language. If it is `undefined` the browser language is detected within the library itself and used for translation.  
The fourth parameter represents the fallback language that is used when loading a language (e.g. the browser language) failed to load.  
The last parameter defines whether the app itself has translation files or not.  

Whenever you actually need only to import `TranslocoModule` in your submodules import `SharedTranslocoModule` instead.

**important**: do provide an array with desired languages even though you not provides translations since libraries that have translations do need this information. Besides, you need this module when you have libraries in your app that have translations. If you do not have translations in your app but you have libraries with i18n you need to set the third parameter to false.

## How to use transloco in your library

Import `SharedTranslocoModule` into your module:

```ts
import { environment } from '../environments/environment';

const loader = ['en'].reduce((acc: any, lang: string) => {
  acc[lang] = () => import(`../assets/i18n/${lang}.json`);
  return acc;
}, {});
.
.
.
imports: [
    SharedTranslocoModule.forChild('scope', loader)
]
```

The first parameter represents the scope that is used within the library for translation.  
Do not forget to add `SharedTranslocoModule.forRoot` into your main app later.

## How to mock translations in unit test

Please import `provideTranslocoTestingModule` into your .spec from `'@schaeffler/transloco/testing'`.  
`provideTranslocoTestingModule` expects the i18n json files as a parameter.

Here is an example:

```ts
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import * as en from '../../../../assets/i18n/en.json';

configureTestSuite(() => {
  TestBed.configureTestingModule({
    ...
    imports: [provideTranslocoTestingModule({ en })],
    ...
  });
});
```

## How to integrate the Language-Select Component

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


## Library Development

### Run Tests

#### Lint

```shell
nx lint shared-transloco
```

#### Unit Tests

```shell
nx test shared-utils-transloco
```

### Run build

```shell
nx run shared-ui-transloco
```
