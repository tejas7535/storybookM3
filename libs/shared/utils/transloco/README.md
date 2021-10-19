# shared-utils-transloco

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-utils-transloco` to execute the unit tests.

## How to use transloco in your app

Import `SharedTranslocoModule` into your main app.module.ts:  
```typescript
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
```typescript
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

## How to unit test translations

Please import `provideTranslocoTestingModule` into your .spec from `'@schaeffler/transloco'`.  
`provideTranslocoTestingModule` expects the i18n json files as a parameter.

Here is an example:
```typescript
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

