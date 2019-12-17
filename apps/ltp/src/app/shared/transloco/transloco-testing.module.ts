import { TranslocoConfig, TranslocoTestingModule } from '@ngneat/transloco';

import * as en from '../../../assets/i18n/en.json';

export const getTranslocoModule = (config: Partial<TranslocoConfig> = {}) =>
  TranslocoTestingModule.withLangs(
    { en },
    {
      availableLangs: ['en'],
      defaultLang: 'en',
      ...config
    }
  );
