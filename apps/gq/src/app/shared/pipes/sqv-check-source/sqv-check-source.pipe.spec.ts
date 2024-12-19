import { Keyboard } from '@gq/shared/models';
import { SqvCheckSource } from '@gq/shared/models/quotation-detail/cost';
import { translate, TranslocoModule } from '@jsverse/transloco';

import { SqvCheckSourcePipe } from './sqv-check-source.pipe';
jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('SqvCheckSourcePipe', () => {
  test('should display dash', () => {
    const pipe = new SqvCheckSourcePipe();
    const result = pipe.transform(null);
    expect(result).toBe(Keyboard.DASH);
  });

  test('should call translate', () => {
    const pipe = new SqvCheckSourcePipe();
    pipe.transform(SqvCheckSource.RELOCATION);
    expect(translate).toHaveBeenCalled();
  });
});
