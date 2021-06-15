import '../../../global-mocks';
import 'jest-preset-angular/setup-jest';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));
