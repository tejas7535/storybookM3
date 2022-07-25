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
    SharedTranslocoModule.forRoot(environment.production, ['de', 'en'], undefined, 'en', 'language', true)
]
```

The first parameter represents whether Transloco should be imported for production with AOT.
The second parameter represents the available languages in your application.
The third parameter defines the default language. If it is `undefined` the browser language is detected within the library itself and used for translation.
The fourth parameter represents the fallback language that is used when loading a language (e.g. the browser language) failed to load.
The fifth parameter defines the name of the local storage item where the selected language is persisted. This should be same value you pass as `TRANSLOCO_PERSIST_LANG_STORAGE` into the `TranslocoPersistLangModule`. Can be `undefined` if the language is not persisted.
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

## How to use transloco in unit test

see [transloco testing](./testing/README.md)

## How to integrate the transloco-related UI components

* see [language-select UI component](components/src/language-select/README.md)
* see [locale-select UI component](components/src/locale-select/README.md)

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
