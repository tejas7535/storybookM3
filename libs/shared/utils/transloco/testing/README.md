# Use transloco in unit test

Integrate [Transloco](https://ngneat.github.io/transloco) i18n library in seconds.
This library provides Transloco modules for usage in apps and as mock in tests as well as useful standardized UI components.

## How to mock translations in unit test

Just import `provideTranslocoTestingModule` into your .spec from `'@schaeffler/transloco/testing'` and put in some mocked (or real) translations with your desired language key.

Here is an example:

```ts
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { mockTranslations } from 'path/to/mockTranslations';

configureTestSuite(() => {
  TestBed.configureTestingModule({
    ...
    imports: [provideTranslocoTestingModule({ en: mockTranslations })],
    ...
  });
});
```
