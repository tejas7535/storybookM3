import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { LOCALE_EN } from '@gq/shared/constants';
import * as constants from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks';
import { GpmEditingModalComponent } from './gpm-editing-modal.component';

jest.mock('../editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

jest.mock('@gq/shared/constants', () => ({
  ...jest.requireActual('@gq/shared/constants'),
  getPercentageRegex: jest.fn((input: any) =>
    jest.requireActual('@gq/shared/constants').getPercentageRegex(input)
  ),
}));

describe('GpmEditingModalComponent', () => {
  let component: GpmEditingModalComponent;
  let spectator: Spectator<GpmEditingModalComponent>;

  const createComponent = createComponentFactory({
    component: GpmEditingModalComponent,
    detectChanges: false,
    imports: [
      DialogHeaderModule,
      MockPipe(PushPipe),
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
      expect(component['validateInput']('99')).toBe(true);
    });

    test('input should not be valid', () => {
      expect(component['validateInput']('-100')).toBe(false);
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
      expect(component['shouldIncrement'](50)).toBe(true);
    });

    test('should not be possible to increment', () => {
      expect(component['shouldIncrement'](100)).toBe(false);
    });
  });

  describe('shouldDecrement', () => {
    test('should be possible to decrement', () => {
      expect(component['shouldDecrement'](99)).toBe(true);
    });

    test('should not be possible to decrement', () => {
      expect(component['shouldDecrement'](-200)).toBe(false);
    });
  });

  test('should build the correct UpdateQuotationDetail', () => {
    const newPrice = 200;
    const getManualPriceByMarginAndCostSpy = jest.spyOn(
      pricingUtils,
      'getManualPriceByMarginAndCost'
    );

    getManualPriceByMarginAndCostSpy.mockReturnValue(newPrice);

    component.modalData = {
      field: ColumnFields.GPM,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };

    expect(component['buildUpdateQuotationDetail'](600)).toEqual({
      price: newPrice,
      gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      priceSource: PriceSource.MANUAL,
    });
    expect(getManualPriceByMarginAndCostSpy).toHaveBeenCalledWith(
      QUOTATION_DETAIL_MOCK.sqv,
      600
    );
  });
});
