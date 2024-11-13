import { translate } from '@jsverse/transloco';
import { when } from 'jest-when';

import { TargetPriceSource } from '../models/quotation/target-price-source.enum';
import * as translateUtils from './translate.utils';
describe('translateUtils', () => {
  test('should translateTargetPriceSourceValue', () => {
    when(translate)
      .calledWith('shared.quotationDetailsTable.targetPriceSource.values', {
        targetPriceSource: TargetPriceSource.CUSTOMER,
      })
      .mockReturnValue('Customer');

    const result = translateUtils.translateTargetPriceSourceValue(
      TargetPriceSource.CUSTOMER
    );

    expect(result).toBe('Customer');
    expect(translate).toHaveBeenCalled();
  });
});
