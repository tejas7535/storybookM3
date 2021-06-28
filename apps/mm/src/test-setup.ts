import { TranslocoModule } from '@ngneat/transloco';

import '../../../global-mocks';
import 'jest-preset-angular/setup-jest';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));
