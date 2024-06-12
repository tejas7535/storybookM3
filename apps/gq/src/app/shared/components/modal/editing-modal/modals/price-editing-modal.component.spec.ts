import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import * as constants from '@gq/shared/constants';
import { LOCALE_EN } from '@gq/shared/constants';
import { PriceSource } from '@gq/shared/models/quotation-detail';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks';
import { PriceEditingModalComponent } from './price-editing-modal.component';

jest.mock('../editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

jest.mock('@gq/shared/constants', () => ({
  ...jest.requireActual('@gq/shared/constants'),
  getCurrencyRegex: jest.fn((input: any) =>
    jest.requireActual('@gq/shared/constants').getCurrencyRegex(input)
  ),
  getPercentageRegex: jest.fn((input: any) =>
    jest.requireActual('@gq/shared/constants').getPercentageRegex(input)
  ),
}));

describe('PriceEditingModalComponent', () => {
  let component: PriceEditingModalComponent;
  let spectator: Spectator<PriceEditingModalComponent>;

  const createComponent = createComponentFactory({
    component: PriceEditingModalComponent,
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

    component.modalData = {
      field: ColumnFields.PRICE,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should be possible to switch between absolute and relative price', () => {
    expect(component.isPriceChangeTypeAvailable).toBeTruthy();
  });

  test('getValue should return 0', () => {
    expect(component.getValue()).toBe(0);
  });

  describe('handlePriceChangeTypeSwitch', () => {
    beforeEach(() => {
      component['setAffectedKpis'] = jest.fn();
    });

    test('should call setAffectedKpis with price', () => {
      component.handlePriceChangeTypeSwitch(true);
      expect(component['setAffectedKpis']).toBeCalledWith(
        QUOTATION_DETAIL_MOCK.price
      );
    });

    test('should call setAffectedKpis with 0', () => {
      component.handlePriceChangeTypeSwitch(false);
      expect(component['setAffectedKpis']).toBeCalledWith(0);
    });
  });

  describe('validateInput', () => {
    const locale = LOCALE_EN.id;

    beforeEach(() => {
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
    });

    test('input should be valid for relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['validateInput']('99')).toBe(true);
    });

    test('input should not be valid for relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['validateInput']('-100')).toBe(false);
    });

    test('input should be valid for absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['validateInput']('10')).toBe(true);
    });

    test('input should not be valid for absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['validateInput']('-1')).toBe(false);
    });

    test('should use percentage regex for relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      const getPercentageRegexSpy = jest.spyOn(constants, 'getPercentageRegex');
      getPercentageRegexSpy.mockReturnValue(/\d{2}\s%/);

      component['validateInput']('100');

      expect(getPercentageRegexSpy).toBeCalledWith(locale);
    });

    test('should use currency regex for absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      const getCurrencyRegexSpy = jest.spyOn(constants, 'getCurrencyRegex');
      getCurrencyRegexSpy.mockReturnValue(/\d{2}\sEUR/);

      component['validateInput']('100');

      expect(getCurrencyRegexSpy).toBeCalledWith(locale);
    });
  });

  test('should always be possible to increment', () => {
    expect(component['shouldIncrement']()).toBe(true);
  });

  describe('shouldDecrement', () => {
    test('should be possible to decrement relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['shouldDecrement'](20)).toBe(true);
    });

    test('should not be possible to decrement relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['shouldDecrement'](-100)).toBe(false);
    });

    test('should be possible to decrement absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['shouldDecrement'](50)).toBe(true);
    });

    test('should not be possible to decrement absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['shouldDecrement'](1)).toBe(false);
    });
  });

  describe('shouldDisableRelativePriceChange', () => {
    test('should not disable relative price change', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          price: 200,
        },
      };
      expect(component['shouldDisableRelativePriceChange']()).toBe(false);
    });

    test('should disable relative price change', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          price: undefined,
        },
      };
      expect(component['shouldDisableRelativePriceChange']()).toBe(true);
    });
  });

  describe('buildUpdateQuotationDetail', () => {
    test('should build the correct UpdateQuotationDetail for relative price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      const newPrice = 350;
      const multiplyAndRoundValuesSpy = jest.spyOn(
        pricingUtils,
        'multiplyAndRoundValues'
      );

      multiplyAndRoundValuesSpy.mockReturnValue(newPrice);

      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        price: newPrice,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        priceSource: PriceSource.MANUAL,
      });
      expect(multiplyAndRoundValuesSpy).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.price,
        1 + 600 / 100
      );
    });

    test('should build the correct UpdateQuotationDetail for absolute price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      const newPrice = 600;
      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        price: newPrice,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        priceSource: PriceSource.MANUAL,
      });
    });
  });
});
