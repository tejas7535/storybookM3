// tslint:disable: ordered-imports
import '../../../global-mocks';
import 'jest-preset-angular';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
