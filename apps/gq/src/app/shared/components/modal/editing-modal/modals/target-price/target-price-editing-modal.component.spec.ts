import { EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { LOCALE_DE } from '@gq/shared/constants';
import * as constants from '@gq/shared/constants';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { TargetPriceEditingModalComponent } from './target-price-editing-modal.component';
jest.mock('../../editing-modal.component', () => ({
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

describe('TargetPriceEditingModalComponent', () => {
  let component: TargetPriceEditingModalComponent;
  let spectator: Spectator<TargetPriceEditingModalComponent>;

  const createComponent = createComponentFactory({
    component: TargetPriceEditingModalComponent,
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

  describe('priceChangeSwitched', () => {
    test('should set the private field', () => {
      component['radioButtonClicked'] = false;
      component.priceChangeSwitched();
      expect(component['radioButtonClicked']).toBe(true);
    });
  });
  describe('handlePriceChangeTypeSwitch', () => {
    beforeEach(() => {
      component['setAffectedKpis'] = jest.fn();
      component['resetKpiValues'] = jest.fn();
      component.affectedKpiOutput = new EventEmitter<KpiValue[]>();
      component.affectedKpiOutput.emit = jest.fn();
    });

    test('should call setAffectedKpis with target price', () => {
      component.handlePriceChangeTypeSwitch(true);
      expect(component['setAffectedKpis']).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.targetPrice
      );
      expect(component['resetKpiValues']).toHaveBeenCalled();
      expect(component.affectedKpiOutput.emit).toHaveBeenCalled();
    });

    test('should call setAffectedKpis with 0', () => {
      component.handlePriceChangeTypeSwitch(false);
      expect(component['setAffectedKpis']).toHaveBeenCalledWith(0);
      expect(component['resetKpiValues']).toHaveBeenCalled();
      expect(component.affectedKpiOutput.emit).toHaveBeenCalled();
    });
  });

  describe('validateInput', () => {
    const locale = LOCALE_DE.id;

    beforeEach(() => {
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
    });

    test('input should be valid for relative target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['validateInput']('99,99')).toBe(true);
    });

    test('input should not be valid for relative target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['validateInput']('99,99R')).toBe(false);
    });

    test('input should be valid for absolute target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['validateInput']('0')).toBe(true);
    });

    test('input should not be valid for absolute target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['validateInput']('-0,5')).toBe(false);
    });

    test('should use percentage regex for relative target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      const getPercentageRegexSpy = jest.spyOn(constants, 'getPercentageRegex');
      getPercentageRegexSpy.mockReturnValue(/\d{2}\s%/);

      component['validateInput']('564');

      expect(getPercentageRegexSpy).toHaveBeenCalledWith(locale);
    });

    test('should use currency regex for absolute target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      const getCurrencyRegexSpy = jest.spyOn(constants, 'getCurrencyRegex');
      getCurrencyRegexSpy.mockReturnValue(/\d{2}\sEUR/);

      component['validateInput']('25');

      expect(getCurrencyRegexSpy).toHaveBeenCalledWith(locale);
    });
  });

  test('should always be possible to increment', () => {
    expect(component['shouldIncrement']()).toBe(true);
  });

  describe('shouldDecrement', () => {
    test('should be possible to decrement relative target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['shouldDecrement'](20)).toBe(true);
    });

    test('should not be possible to decrement relative target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;
      expect(component['shouldDecrement'](-100)).toBe(false);
    });

    test('should be possible to decrement absolute target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['shouldDecrement'](50)).toBe(true);
    });

    test('should not be possible to decrement absolute target price', () => {
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['shouldDecrement'](1)).toBe(false);
    });
  });

  describe('shouldDisableRelativePriceChange', () => {
    test('should not disable relative target price change', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          targetPrice: 560,
        },
      };
      expect(component['shouldDisableRelativePriceChange']()).toBe(false);
    });

    test('should disable relative target price change', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          targetPrice: undefined,
        },
      };
      expect(component['shouldDisableRelativePriceChange']()).toBe(true);
    });
  });

  describe('buildUpdateQuotationDetail', () => {
    test('should build the correct UpdateQuotationDetail for relative target price, targetPriceSource did not change', () => {
      component.modalData.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['editingFormGroup'] = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: true })
          .mockReturnValueOnce({
            value: QUOTATION_DETAIL_MOCK.targetPriceSource,
          }),
      } as any;
      const newPrice = 350;
      const multiplyAndRoundValuesSpy = jest.spyOn(
        pricingUtils,
        'multiplyAndRoundValues'
      );

      multiplyAndRoundValuesSpy.mockReturnValue(newPrice);

      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        targetPrice: newPrice,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      });
      expect(multiplyAndRoundValuesSpy).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.targetPrice,
        1 + 600 / 100
      );
    });

    test('should build the correct UpdateQuotationDetail for absolute target price, targetPriceSource did not change', () => {
      component.modalData.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['editingFormGroup'] = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: false })
          .mockReturnValueOnce({
            value: QUOTATION_DETAIL_MOCK.targetPriceSource,
          }),
      } as any;
      const newPrice = 600;

      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        targetPrice: newPrice,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      });
    });
    test('should build the correct UpdateQuotationDetail for absolute target price and targetPriceSource changed', () => {
      component.modalData.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['editingFormGroup'] = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: false })
          .mockReturnValueOnce({
            value: TargetPriceSource.CUSTOMER,
          }),
      } as any;
      const newPrice = 600;

      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        targetPrice: newPrice,
        targetPriceSource: TargetPriceSource.CUSTOMER,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      });
    });
    test('should return undefined for targetPriceSource when NO_ENTRY', () => {
      component['editingFormGroup'] = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: false })
          .mockReturnValueOnce({
            value: TargetPriceSource.NO_ENTRY,
          }),
      } as any;

      expect(component['buildUpdateQuotationDetail'](600)).toEqual({
        targetPrice: 600,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      });
    });

    test('should return undefined for TargetPrice when just TargetPriceSource has changed', () => {
      component.modalData.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['editingFormGroup'] = {
        get: jest
          .fn()
          .mockReturnValueOnce({ value: false })
          .mockReturnValueOnce({
            value: TargetPriceSource.CUSTOMER,
          }),
      } as any;

      expect(component['buildUpdateQuotationDetail'](0)).toEqual({
        targetPriceSource: TargetPriceSource.CUSTOMER,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
      });
    });
  });

  describe('handleAdditionalContent', () => {
    const targetPriceFormControl: FormControl = new FormControl(undefined);
    const targetPriceSourceFormControl: FormControl = new FormControl(
      undefined
    );
    const editingFormGroup = new FormGroup<{
      valueInput: FormControl<string | undefined>;
      additionalContentValue?: FormControl;
    }>({
      valueInput: targetPriceFormControl,
      additionalContentValue: targetPriceSourceFormControl,
    });
    describe('isTargetPriceSourceEditable is true', () => {
      beforeEach(() => {
        Object.defineProperty(component, 'isTargetPriceSourceEditable', {
          value: true,
        });
        Object.defineProperty(component, 'VALUE_FORM_CONTROL_NAME', {
          value: 'valueInput',
        });
        Object.defineProperty(component, 'subscription', {
          value: { add: jest.fn() },
        });

        Object.defineProperty(component, 'ADDITIONAL_CONTENT_CONTROL_NAME', {
          value: 'additionalContentValue',
        });
        Object.defineProperty(component, 'translocoLocaleService', {
          value: { getLocale: jest.fn().mockReturnValue(LOCALE_DE.id) },
        });
        Object.defineProperty(component, 'handleHasValueChanged', {
          value: jest.fn(),
        });
        Object.defineProperty(component, 'setAffectedKpis', {
          value: jest.fn(),
        });
        component['editingFormGroup'] = editingFormGroup;
      });

      test('when targetPrice is changing the targetPriceSource needs to be updated', () => {
        targetPriceSourceFormControl.setValue('noEntry');
        component.handleAdditionalContent();
        targetPriceFormControl.setValue('100');
        expect(targetPriceSourceFormControl.value).toBe('INTERNAL');
        // when radioButton is clicked source shall persist
        component['radioButtonClicked'] = true;
        targetPriceFormControl.setValue('');
        expect(targetPriceSourceFormControl.value).toBe('INTERNAL');
      });
      test('when targetPriceSource is changing the targetPrice needs to be updated', () => {
        targetPriceFormControl.setValue('100');
        targetPriceSourceFormControl.setValue('INTERNAL');
        component.handleAdditionalContent();
        targetPriceSourceFormControl.setValue('noEntry');
        expect(targetPriceFormControl.value).toBe(undefined);
      });
      test('when targetPriceSource is changing the targetPrice needs to be updated on non number input', () => {
        targetPriceFormControl.setValue('a');
        targetPriceSourceFormControl.setValue('INTERNAL');
        component.handleAdditionalContent();
        expect(targetPriceFormControl.value).toBe('a');
      });
      test('should set NO_Entry as default value for targetPriceSource', () => {
        component.modalData.quotationDetail.targetPriceSource = undefined;
        component.handleAdditionalContent();
        expect(targetPriceSourceFormControl.value).toBe('noEntry');
      });
    });
    describe('isTargetPriceSourceEditable is false', () => {
      test('should stop when isTargetPriceSourceEditable is false', () => {
        jest.resetAllMocks();
        component['editingFormGroup'] = editingFormGroup;
        Object.defineProperty(component, 'isTargetPriceSourceEditable', {
          value: false,
        });
        component.editingFormGroup.get = jest.fn();
        component.handleAdditionalContent();
        expect(component.editingFormGroup.get).not.toHaveBeenCalled();
      });
    });
  });
});
