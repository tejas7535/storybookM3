import {
  HashMap,
  TranslocoConfig,
  TranslocoTestingModule,
} from '@ngneat/transloco';

export const provideTranslocoTestingModule = (
  langs: HashMap<HashMap>,
  config: Partial<TranslocoConfig> = {}
) =>
  TranslocoTestingModule.withLangs(langs, {
    availableLangs: ['en'],
    defaultLang: 'en',
    ...config,
  });
