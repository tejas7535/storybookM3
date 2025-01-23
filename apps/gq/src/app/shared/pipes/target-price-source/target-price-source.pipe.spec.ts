import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import * as translateUtils from '@gq/shared/utils/translate.utils';

import { TargetPriceSourcePipe } from './target-price-source.pipe';

describe('targetPriceSourcePipe', () => {
  beforeEach(() => jest.resetAllMocks());
  it('create an instance', () => {
    const pipe = new TargetPriceSourcePipe();
    expect(pipe).toBeTruthy();
  });

  test('should call the translateTargetPriceSource method', () => {
    const translateMock = jest
      .spyOn(translateUtils, 'translateTargetPriceSourceValue')
      .mockReturnValue('Customer');

    const pipe = new TargetPriceSourcePipe();
    const result = pipe.transform(TargetPriceSource.CUSTOMER);
    expect(result).toBe('Customer');
    expect(translateMock).toHaveBeenCalled();
  });
  test('should return "-" when dashForNoEntry is true and targetPriceSource is NO_ENTRY', () => {
    const pipe = new TargetPriceSourcePipe();
    const result = pipe.transform(TargetPriceSource.NO_ENTRY, true);
    expect(result).toBe('-');
  });
});
