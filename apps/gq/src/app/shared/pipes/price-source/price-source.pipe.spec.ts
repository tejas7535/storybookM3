import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import { QuotationDetail, SapPriceCondition } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
import { when } from 'jest-when';

import { PriceSourcePipe } from './price-source.pipe';

describe('PriceSourcePipe', () => {
  beforeEach(() => jest.resetAllMocks());
  it('create an instance', () => {
    const pipe = new PriceSourcePipe();
    expect(pipe).toBeTruthy();
  });
  test('should return SAP_STANDARD as a default price source', () => {
    const pipe = new PriceSourcePipe();
    const detail = {
      sapPriceCondition: SapPriceCondition.STANDARD,
      leadingSapConditionType: null,
    } as QuotationDetail;

    when(translate)
      .calledWith('shared.quotationDetailsTable.priceSourceLabel', {
        priceSource: 'SAP_STANDARD',
      })
      .mockReturnValue('SAP Standard');

    const result = pipe.transform(detail);
    expect(result).toBe('SAP Standard');
    expect(translate).toHaveBeenCalled();
  });
  test('should return SECTOR_DISCOUNT when leading sap condition type is ZSEK', () => {
    const pipe = new PriceSourcePipe();
    const detail = {
      sapPriceCondition: SapPriceCondition.STANDARD,
      leadingSapConditionType: SapConditionType.ZSEK,
    } as QuotationDetail;

    when(translate)
      .calledWith('shared.quotationDetailsTable.priceSourceLabel', {
        priceSource: 'SECTOR_DISCOUNT',
      })
      .mockReturnValue('Sector Discount');

    const result = pipe.transform(detail);
    expect(result).toBe('Sector Discount');
    expect(translate).toHaveBeenCalled();
  });
});
