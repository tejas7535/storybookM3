import 'jest-preset-angular/setup-jest';

import { TranslocoModule } from '@jsverse/transloco';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));
