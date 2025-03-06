import { FormControl, FormGroup } from '@angular/forms';

import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/validation/quotation-details-table-validation.service';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import * as constants from '@gq/shared/constants';
import { LOCALE_EN } from '@gq/shared/constants';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { EditingModalComponent } from '../editing-modal.component';
import { QuantityEditingModalComponent } from './quantity-editing-modal.component';

jest.mock('../editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

jest.mock('@gq/shared/constants', () => ({
  ...jest.requireActual('@gq/shared/constants'),
  getQuantityRegex: jest.fn((input: any) =>
    jest.requireActual('@gq/shared/constants').getQuantityRegex(input)
  ),
}));

describe('QuantityEditingModalComponent', () => {
  let component: QuantityEditingModalComponent;
  let spectator: Spectator<QuantityEditingModalComponent>;
  let transformationService: TransformationService;

  const createComponent = createComponentFactory({
    component: QuantityEditingModalComponent,
    detectChanges: false,
    imports: [
      DialogHeaderModule,
      MockPipe(PushPipe),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [mockProvider(TransformationService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    transformationService = spectator.inject(TransformationService);
    component.modalData = {
      field: ColumnFields.ORDER_QUANTITY,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onInit', () => {
    test('should call setHintTextParams', () => {
      EditingModalComponent.prototype.ngOnInit = jest.fn();
      component['setHintTextParams'] = jest.fn();
      component.ngOnInit();
      expect(component['setHintTextParams']).toHaveBeenCalled();
    });
    test('should call setIncrementsAndDecrementSteps', () => {
      EditingModalComponent.prototype.ngOnInit = jest.fn();
      Object.defineProperty(component, 'isNewCaseCreation', { value: true });
      component['setIncrementsAndDecrementSteps'] = jest.fn();
      component.ngOnInit();
      expect(component['setIncrementsAndDecrementSteps']).toHaveBeenCalled();
    });
  });

  describe('getInitialValue', () => {
    test('should return the value if delivery unit is not set', () => {
      component.modalData.quotationDetail.deliveryUnit = undefined;
      const value = 100;

      expect(component.getInitialValue(value)).toBe(value);
    });
    test('should return the next higher possible multiple', () => {
      component.modalData.quotationDetail.deliveryUnit = 50;
      const value = 101;
      expect(component.getInitialValue(value)).toBe(150);
    });
  });
  test('should not show decimal places in input field placeholder', () => {
    const value = QUOTATION_DETAIL_MOCK.orderQuantity;
    const transformNumberSpy = jest.spyOn(
      transformationService,
      'transformNumber'
    );
    transformNumberSpy.mockReturnValue(value.toString());

    component['transformationService'] = transformationService;

    expect(component.getLocaleValue(value)).toBe(value.toString());
    expect(transformNumberSpy).toHaveBeenCalledWith(value, false);
  });

  test('should handle input field keydown event', () => {
    const validateQuantityInputKeyPressSpy = jest.spyOn(
      miscUtils,
      'validateQuantityInputKeyPress'
    );
    validateQuantityInputKeyPressSpy.mockImplementation();

    const testEvent = { test: 'test' } as any;
    component.handleInputFieldKeyDown(testEvent);

    expect(validateQuantityInputKeyPressSpy).toHaveBeenCalledWith(testEvent);
  });

  describe('validateInput', () => {
    const locale = LOCALE_EN.id;
    let isOrderQuantityInvalidSpy: jest.SpyInstance;

    beforeEach(() => {
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;

      isOrderQuantityInvalidSpy = jest.spyOn(
        QuotationDetailsTableValidationService,
        'isOrderQuantityInvalid'
      );

      component['editingFormGroup'] = new FormGroup<{
        valueInput: FormControl<string | undefined>;
        isRelativePriceChangeRadioGroup?: FormControl<boolean>;
      }>({ valueInput: new FormControl(undefined) });
      Object.defineProperty(component, 'VALUE_FORM_CONTROL_NAME', {
        value: 'valueInput',
      });
    });

    test('input should be valid', () => {
      isOrderQuantityInvalidSpy.mockReturnValue(false);

      expect(component['validateInput']('2')).toBe(true);
      expect(component.warningText).toBeUndefined();
    });

    test('input should not be valid', () => {
      isOrderQuantityInvalidSpy.mockReturnValue(true);

      expect(component['validateInput']('0')).toBe(false);
    });

    test('should use quantity regex', () => {
      const getQuantityRegexSpy = jest.spyOn(constants, 'getQuantityRegex');
      getQuantityRegexSpy.mockReturnValue(/\d+/);

      component['validateInput']('100');

      expect(getQuantityRegexSpy).toHaveBeenCalledWith(locale);
    });

    test('should set error when Validation Failed and isNewCaseCreation', () => {
      isOrderQuantityInvalidSpy.mockReturnValue(true);
      Object.defineProperty(component, 'isNewCaseCreation', { value: true });

      component['validateInput']('12');

      expect(component['editingFormGroup'].get('valueInput').errors).toEqual({
        invalidInput: true,
      });
    });
  });

  test('should always be possible to increment', () => {
    expect(component['shouldIncrement']()).toBe(true);
  });

  describe('shouldDecrement', () => {
    test('should be possible to decrement', () => {
      expect(component['shouldDecrement'](2)).toBe(true);
    });

    test('should not be possible to decrement', () => {
      expect(component['shouldDecrement'](1)).toBe(false);
    });
  });

  test('should build the correct UpdateQuotationDetail', () => {
    const newQuantity = 500;

    expect(component['buildUpdateQuotationDetail'](newQuantity)).toEqual({
      orderQuantity: newQuantity,
      gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
    });
  });

  describe('should set Increments And Decrement Steps', () => {
    test('should set increment and decrement steps', () => {
      component.incrementStep = undefined;
      component.decrementStep = undefined;
      component.modalData.quotationDetail.deliveryUnit = 5;

      component['setIncrementsAndDecrementSteps']();
      expect(component.incrementStep).toBe(5);
      expect(component.decrementStep).toBe(-5);
    });
  });
  describe('setHintTextParams', () => {
    test('should set increment and decrement steps', () => {
      component.modalData.quotationDetail.deliveryUnit = 5;
      component.modalData.quotationDetail.material.baseUoM = 'm';
      component.showFieldHint = false;
      component.hintMsgParams1 = undefined;
      component.hintMsgParams2 = undefined;
      component['setHintTextParams']();
      expect(component.showFieldHint).toBe(true);
      expect(component.hintMsgParams1).toBe('5');
      expect(component.hintMsgParams2).toBe('m');
    });
  });

  describe('getNumberFromStringValue', () => {
    test('should return the number from a transformed number string for EN', () => {
      const locale = LOCALE_EN.id;
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
      const value = '123,000';

      component['getNumberFromStringValue'](value);

      expect(component['getNumberFromStringValue'](value)).toBe(123_000);
    });

    test('should return the number from a transformed number string for DE', () => {
      const locale = constants.LOCALE_DE.id;
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
      const value = '123.000';

      component['getNumberFromStringValue'](value);

      expect(component['getNumberFromStringValue'](value)).toBe(123_000);
    });

    test('should return null, when the value did not met the regex', () => {
      const locale = constants.LOCALE_DE.id;
      component['translocoLocaleService'] = {
        getLocale: jest.fn().mockReturnValue(locale),
      } as any;
      const value = 'a';

      expect(component['getNumberFromStringValue'](value)).toBeNull();
    });
  });
});
