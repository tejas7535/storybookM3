import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { LOCALE_EN } from '@gq/shared/constants';
import * as constants from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks';
import { GpiEditingModalComponent } from './gpi-editing-modal.component';

jest.mock('../editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

describe('GpiEditingModalComponent', () => {
  let component: GpiEditingModalComponent;
  let spectator: Spectator<GpiEditingModalComponent>;

  const createComponent = createComponentFactory({
    component: GpiEditingModalComponent,
    detectChanges: false,
    imports: [
      DialogHeaderModule,
      MockModule(PushModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateInput', () => {
    const locale = LOCALE_EN.id;

    beforeEach(() => {
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
    });

    test('input should be valid', () => {
      expect(component['validateInput']('25.50')).toBe(true);
    });

    test('input should not be valid', () => {
      expect(component['validateInput']('30,25')).toBe(false);
    });

    test('should use percentage regex', () => {
      const getPercentageRegexSpy = jest.spyOn(constants, 'getPercentageRegex');
      getPercentageRegexSpy.mockReturnValue(/\d{2}\s%/);

      component['validateInput']('100');

      expect(getPercentageRegexSpy).toBeCalledWith(locale);
    });
  });

  describe('shouldIncrement', () => {
    test('should be possible to increment', () => {
      expect(component['shouldIncrement'](10)).toBe(true);
    });

    test('should not be possible to increment', () => {
      expect(component['shouldIncrement'](102)).toBe(false);
    });
  });

  describe('shouldDecrement', () => {
    test('should be possible to decrement', () => {
      expect(component['shouldDecrement'](2)).toBe(true);
    });

    test('should not be possible to decrement', () => {
      expect(component['shouldDecrement'](-120)).toBe(false);
    });
  });

  test('should build the correct UpdateQuotationDetail', () => {
    const priceUnit = 200;
    const newPrice = 50;
    const getManualPriceByMarginAndCostSpy = jest.spyOn(
      pricingUtils,
      'getManualPriceByMarginAndCost'
    );
    const getPriceUnitSpy = jest.spyOn(pricingUtils, 'getPriceUnit');

    getManualPriceByMarginAndCostSpy.mockReturnValue(newPrice);
    getPriceUnitSpy.mockReturnValue(priceUnit);

    component.modalData = {
      field: ColumnFields.GPI,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    expect(component['buildUpdateQuotationDetail'](450)).toEqual({
      price: newPrice / priceUnit,
      gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      priceSource: PriceSource.MANUAL,
    });
    expect(getManualPriceByMarginAndCostSpy).toHaveBeenCalledWith(
      QUOTATION_DETAIL_MOCK.gpc,
      450
    );
    expect(getPriceUnitSpy).toHaveBeenCalledWith(QUOTATION_DETAIL_MOCK);
  });
});
