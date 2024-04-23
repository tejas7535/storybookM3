import { TranslocoModule } from '@jsverse/transloco';

import { MultiSelectPipe } from './multi-select.pipe';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'other'),
}));
describe('MultiSelectPipe', () => {
  test('create an instance', () => {
    const pipe = new MultiSelectPipe();
    expect(pipe).toBeTruthy();
  });

  test('should return mat-select-trigger value with additional text', () => {
    const pipe = new MultiSelectPipe();
    const result = pipe.transform(['20', '30', '40', 0, '80', '90']);

    expect(result).toEqual('20, 30, 40, 80 (1 other)');
  });
  test('should return mat-select-trigger value without additional text', () => {
    const pipe = new MultiSelectPipe();
    const result = pipe.transform(['20', '30']);

    expect(result).toEqual('20, 30');
  });
});
