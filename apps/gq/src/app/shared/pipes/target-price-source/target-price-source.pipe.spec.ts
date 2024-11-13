import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';
import * as translateUtils from '@gq/shared/utils/translate.utils';

import { TargetPriceSourcePipe } from './target-price-source.pipe';

describe('targetPriceSourcePipe', () => {
  beforeEach(() => jest.resetAllMocks());
  it('create an instance', () => {
    const pipe = new TargetPriceSourcePipe();
    expect(pipe).toBeTruthy();
  });

  test('should call the translateTargetPriceSource mehtod', () => {
    const translateMock = jest
      .spyOn(translateUtils, 'translateTargetPriceSourceValue')
      .mockReturnValue('Customer'); //  translateUtils.translateTargetPriceSourceValue = jest.fn()).mockReturnValue('Customer');

    const pipe = new TargetPriceSourcePipe();
    const result = pipe.transform({
      targetPriceSource: TargetPriceSource.CUSTOMER,
    } as QuotationDetail);
    expect(result).toBe('Customer');
    expect(translateMock).toHaveBeenCalled();
  });
});
