import 'jest-preset-angular/setup-jest';

import { TranslocoModule } from '@ngneat/transloco';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));
