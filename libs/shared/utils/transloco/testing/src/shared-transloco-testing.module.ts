import { ModuleWithProviders } from '@angular/core';

import {
  HashMap,
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { MockModule, Type } from 'ng-mocks';

export const provideTranslocoTestingModule: (
  langs: HashMap<HashMap>,
  options?: Partial<TranslocoTestingOptions>
) => (
  | ModuleWithProviders<TranslocoTestingModule>
  | Type<TranslocoLocaleModule>
)[] = (
  langs: HashMap<HashMap>,
  options: Partial<TranslocoTestingOptions> = {}
) => [
  TranslocoTestingModule.forRoot({
    langs,
    translocoConfig: {
      availableLangs: Object.keys(langs),
      defaultLang: Object.keys(langs)[0],
    },
    ...options,
  }),
  MockModule(TranslocoLocaleModule),
];
