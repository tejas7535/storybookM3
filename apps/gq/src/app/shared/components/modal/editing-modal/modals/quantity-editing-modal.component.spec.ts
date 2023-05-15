import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/quotation-details-table-validation.service';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { LOCALE_EN } from '@gq/shared/constants';
import * as constants from '@gq/shared/constants';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../../testing/mocks';
import { QuantityEditingModalComponent } from './quantity-editing-modal.component';

jest.mock('../editing-modal.component', () => ({
  EditingModalComponent: jest.fn(),
}));

describe('QuantityEditingModalComponent', () => {
  let component: QuantityEditingModalComponent;
  let spectator: Spectator<QuantityEditingModalComponent>;

  const createComponent = createComponentFactory({
    component: QuantityEditingModalComponent,
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
    component.modalData = {
      field: ColumnFields.ORDER_QUANTITY,
      quotationDetail: QUOTATION_DETAIL_MOCK,
    };
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should handle input field keydown event', () => {
    const validateQuantityInputKeyPressSpy = jest.spyOn(
      HelperService,
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
    });

    test('input should be valid', () => {
      isOrderQuantityInvalidSpy.mockReturnValue(false);

      expect(component['validateInput']('2')).toBe(true);
      expect(component.warningText).toBeUndefined();
    });

    test('input should not be valid', () => {
      isOrderQuantityInvalidSpy.mockReturnValue(true);

      expect(component['validateInput']('0')).toBe(false);
      expect(component.warningText).toBe('translate it');
      expect(translate).toHaveBeenCalledWith(
        'shared.validation.orderQuantityMustBeMultipleOf',
        { deliveryUnit: QUOTATION_DETAIL_MOCK.deliveryUnit }
      );
    });

    test('should use quantity regex', () => {
      const getQuantityRegexSpy = jest.spyOn(constants, 'getQuantityRegex');
      getQuantityRegexSpy.mockReturnValue(/\d+/);

      component['validateInput']('100');

      expect(getQuantityRegexSpy).toBeCalledWith(locale);
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
});
