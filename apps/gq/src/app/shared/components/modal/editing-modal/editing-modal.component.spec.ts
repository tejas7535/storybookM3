import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { SimulationService } from '@gq/process-case-view/quotation-details-table/services/simulation/simulation.service';
import { PriceSource } from '@gq/shared/models';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../../testing/mocks/state/active-case-state.mock';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from './editing-modal.component';

@Component({
  selector: 'gq-test-editing-modal',
})
class TestEditingModalComponent extends EditingModalComponent {
  handlePriceChangeTypeSwitch(): void {}

  handleInputFieldKeyDown(): void {
    return undefined;
  }

  getInitialValue(): number {
    return undefined;
  }
  protected validateInput(): boolean {
    return undefined;
  }

  protected shouldIncrement(): boolean {
    return undefined;
  }

  protected shouldDecrement(): boolean {
    return undefined;
  }

  protected shouldDisableRelativePriceChange(): boolean {
    return undefined;
  }

  protected buildUpdateQuotationDetail(): UpdateQuotationDetail {
    return undefined;
  }
}

// All subclasses need to be mocked.
// Otherwise following error is thrown: "Class extends value undefined is not a constructor or null"
jest.mock('./modals/discount-editing-modal.component');
jest.mock('./modals/gpi-editing-modal.component');
jest.mock('./modals/gpm-editing-modal.component');
jest.mock('./modals/price-editing-modal.component');
jest.mock('./modals/target-price-editing-modal.component');
jest.mock('./modals/quantity-editing-modal.component');

describe('TestEditingModalComponent', () => {
  let component: TestEditingModalComponent;
  let spectator: Spectator<TestEditingModalComponent>;
  let store: MockStore;
  let transformationService: TransformationService;

  const VALUE_FORM_CONTROL_NAME = 'valueInput';
  const IS_RELATIVE_PRICE_CONTROL_NAME = 'isRelativePriceChangeRadioGroup';

  const createComponent = createComponentFactory({
    component: TestEditingModalComponent,
    imports: [ReactiveFormsModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
        },
      }),
      mockProvider(TranslocoLocaleService),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: TransformationService,
        useValue: {
          transformNumber: jest.fn().mockImplementation((value, showDigits) =>
            Intl.NumberFormat('de-DE', {
              minimumFractionDigits: showDigits ? 2 : undefined,
              maximumFractionDigits: showDigits ? 2 : 0,
            }).format(value)
          ),
        },
      },
    ],
    mocks: [SimulationService],
    detectChanges: false,
  });

  const updateFormValue = (value: string) => {
    component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).setValue(value);
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component['simulationService'].calculateAffectedKPIs = jest.fn();
    store = spectator.inject(MockStore);
    transformationService = spectator.inject(TransformationService);
    spectator.setInput('modalData', {
      quotationDetail: QUOTATION_DETAIL_MOCK,
      field: ColumnFields.DISCOUNT,
    });
    spectator.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initialize observables',
      marbles((m) => {
        component['subscribeLoadingStopped'] = jest.fn();
        spectator.detectChanges();

        component.ngOnInit();

        m.expect(component.updateLoading$).toBeObservable('a', {
          a: ACTIVE_CASE_STATE_MOCK.updateLoading,
        });
        expect(component['subscribeLoadingStopped']).toHaveBeenCalledTimes(1);
      })
    );

    test('should deactivate the switch between relative and absolute price', () => {
      component.isPriceChangeTypeAvailable = false;
      component.ngOnInit();

      expect(
        component.editingFormGroup.get(IS_RELATIVE_PRICE_CONTROL_NAME)
      ).toBeNull();
    });

    test('should activate the switch between relative and absolute price', () => {
      component.isPriceChangeTypeAvailable = true;
      component['shouldDisableRelativePriceChange'] = jest
        .fn()
        .mockReturnValue(false);
      component.ngOnInit();

      expect(component.isRelativePriceChangeDisabled).toBe(false);
      expect(
        component.editingFormGroup.get(IS_RELATIVE_PRICE_CONTROL_NAME).value
      ).toEqual(false);
    });

    test('should activate the switch between relative and absolute price but disable relative price', () => {
      component.isPriceChangeTypeAvailable = true;
      component['shouldDisableRelativePriceChange'] = jest
        .fn()
        .mockReturnValue(true);
      component.ngOnInit();

      expect(component.isRelativePriceChangeDisabled).toBe(true);
      expect(
        component.editingFormGroup.get(IS_RELATIVE_PRICE_CONTROL_NAME).value
      ).toEqual(false);
    });

    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();
      component.ngOnInit();
      expect(component['subscription'].add).toHaveBeenCalledTimes(2);
    });
  });

  describe('ngAfterViewInit', () => {
    test('should initialize component variables', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component['setAffectedKpis'] = jest.fn();

      component.editInputField = {
        nativeElement: {
          focus: jest.fn(),
        },
      };
      spectator.detectComponentChanges();
      component.ngAfterViewInit();

      expect(component['value']).toEqual(QUOTATION_DETAIL_MOCK.gpi);
      expect(component['setAffectedKpis']).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.gpi
      );
      expect(component.localeValue).toEqual('90,00');
      expect(
        component.editInputField.nativeElement.focus
      ).toHaveBeenCalledTimes(1);
    });

    test('should validate input directly', () => {
      component['validateInput'] = jest.fn();
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      component.modalData.quotationDetail.orderQuantity = 10;

      component.ngAfterViewInit();

      expect(component['validateInput']).toHaveBeenCalledWith('10');
    });
    test('should setInitialValue', () => {
      Object.defineProperty(component, 'isNewCaseCreation', { value: true });
      component.getInitialValue = jest.fn().mockReturnValue(10);
      component.ngAfterViewInit();
      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('10');
    });
  });

  describe('ngOnDestroy', () => {
    test('should add subscriptions', () => {
      component['subscription'].unsubscribe = jest.fn();
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmDisabled', () => {
    beforeEach(() => {
      component['setAffectedKpis'] = jest.fn();
      component['subscribeInputValueChanges']();
    });

    test('should disable editing because of missing value', () => {
      updateFormValue(undefined as any);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toBeFalsy();
      expect(component['setAffectedKpis']).toHaveBeenCalledTimes(2);
    });

    test('should disable editing', () => {
      component['validateInput'] = jest.fn().mockReturnValue(false);
      updateFormValue('123');

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).valid
      ).toEqual(false);
      expect(component['setAffectedKpis']).toHaveBeenCalledTimes(2);
    });

    test('should enable editing', () => {
      component['validateInput'] = jest.fn().mockReturnValue(true);
      updateFormValue('456');

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).valid
      ).toEqual(true);
      expect(component['setAffectedKpis']).toHaveBeenCalledTimes(2);
    });
  });

  describe('setAffectedKpis', () => {
    test('should set affected kpis', () => {
      jest
        .spyOn(component['simulationService'], 'calculateAffectedKPIs')
        .mockImplementation(() => []);
      component['setAffectedKpis'](1);

      expect(component.affectedKpis).toEqual([]);
    });

    test('should pass isRelativePrice as false correctly', () => {
      component.isPriceChangeTypeAvailable = true;
      component.ngOnInit();
      jest
        .spyOn(component['simulationService'], 'calculateAffectedKPIs')
        .mockImplementation(() => [{ key: ColumnFields.PRICE, value: 1 }]);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };

      component.editingFormGroup
        .get(IS_RELATIVE_PRICE_CONTROL_NAME)
        .setValue(false);
      component['setAffectedKpis'](1);

      expect(
        component['simulationService'].calculateAffectedKPIs
      ).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        false
      );
      expect(component.affectedKpis).toEqual([
        { key: ColumnFields.PRICE, value: 1 },
      ]);
    });

    test('should pass isRelativePrice as true correctly', () => {
      component.isPriceChangeTypeAvailable = true;
      component.ngOnInit();
      jest
        .spyOn(component['simulationService'], 'calculateAffectedKPIs')
        .mockImplementation(() => []);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editingFormGroup
        .get(IS_RELATIVE_PRICE_CONTROL_NAME)
        .setValue(true);
      component['setAffectedKpis'](1);

      expect(
        component['simulationService'].calculateAffectedKPIs
      ).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        true
      );
      expect(component.affectedKpis).toEqual([]);
    });

    test('should call the EventEmitters', () => {
      component.affectedKpiOutput.emit = jest.fn();
      component.isInvalidOrUnchanged.emit = jest.fn();
      component['setAffectedKpis'](1);
      expect(component.affectedKpiOutput.emit).toHaveBeenCalled();
      expect(component.isInvalidOrUnchanged.emit).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmEditing', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    test('should confirm editing', () => {
      const testData = {
        price: 500,
        gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        priceSource: PriceSource.MANUAL,
      };

      store.dispatch = jest.fn();
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockImplementation();
      component['buildUpdateQuotationDetail'] = jest
        .fn()
        .mockReturnValue(testData);

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList: [testData],
        })
      );
    });
  });

  describe('increment', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should increment', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(1);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('2');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        2,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should increment on placeholder value', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(0);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['value'] = 10;

      component.changeValueIncrementally(1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('11');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        11,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should not increment', () => {
      updateFormValue('99');
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(99);
      component['shouldIncrement'] = jest.fn().mockReturnValue(false);

      component.changeValueIncrementally(1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('99');
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(1);
    });

    test('should use 0 if the value is not parsable', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(0);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['value'] = '' as unknown as number;
      updateFormValue(undefined as any);

      component.changeValueIncrementally(1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('1');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        1,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should increment float value', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(10.25);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('11,25');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        11.25,
        true
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should increment by 50', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(50);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('100');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        100,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });
  });

  describe('decrement', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should decrement', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(100);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(-1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('99');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        99,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should not decrement', () => {
      updateFormValue('1');
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(1);
      component['shouldDecrement'] = jest.fn().mockReturnValue(false);

      component.changeValueIncrementally(-1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('1');
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(1);
    });

    test('should decrement negative', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(-90);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(-1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('-91');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        -91,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should decrement on placeholder value', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(0);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);
      component['value'] = 10;

      component.changeValueIncrementally(-1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('9');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        9,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should decrement float value', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(10.25);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(-1);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('9,25');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        9.25,
        true
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should decrement by 50', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(100);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);

      component.changeValueIncrementally(-50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('50');
      expect(transformationService.transformNumber).toHaveBeenCalledWith(
        50,
        false
      );
      expect(transformationService.transformNumber).toHaveBeenCalledTimes(2);
    });
  });

  describe('increment/decrement by Step', () => {
    test('should increment by 50', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(12);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);
      component.incrementStep = 50;
      component.decrementStep = 50;
      component.changeValueIncrementally(50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('50');
    });

    test('should decrement by 50', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(112);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);
      component.incrementStep = 50;
      component.decrementStep = 50;
      component.changeValueIncrementally(-50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('100');
    });

    test('should increment by 50 when value is already a multiple', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(50);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);
      component.incrementStep = 50;
      component.decrementStep = 50;
      component.changeValueIncrementally(50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('100');
    });
    test('should decrement by 50 when value is already a multiple', () => {
      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockReturnValue(100);
      component['shouldIncrement'] = jest.fn().mockReturnValue(true);
      component['shouldDecrement'] = jest.fn().mockReturnValue(true);
      component.incrementStep = 50;
      component.decrementStep = 50;
      component.changeValueIncrementally(-50);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('50');
    });
  });

  describe('radio button change', () => {
    test('should reset form value on radio button change', () => {
      updateFormValue('45');
      component['handlePriceChangeTypeSwitch'] = jest.fn();

      component.callPriceChangeTypeSwitchHandler(true);

      expect(
        component.editingFormGroup.get(VALUE_FORM_CONTROL_NAME).value
      ).toEqual('');
      expect(component['handlePriceChangeTypeSwitch']).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('callInputFieldKeyDownHandler', () => {
    test('should call input field keydown handler', () => {
      component['handleInputFieldKeyDown'] = jest.fn();
      const event = {
        field1: 'test 1',
        field2: 'test 2',
      } as any;

      component.callInputFieldKeyDownHandler(event);

      expect(component['handleInputFieldKeyDown']).toHaveBeenCalledWith(event);
    });
  });

  describe('determineAbsoluteValue', () => {
    test('should determine absolute value if no switch between absolute and relative price is possible', () => {
      component.isPriceChangeTypeAvailable = false;
      expect(component['determineAbsoluteValue'](250)).toBe(250);
    });

    test('should determine absolute value if the current value is absolute', () => {
      component.isPriceChangeTypeAvailable = true;
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: false }),
      } as any;
      expect(component['determineAbsoluteValue'](250)).toBe(250);
    });

    test('should determine absolute value if the current value is relative', () => {
      const testData = {
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
      };

      component.modalData = testData;
      component.isPriceChangeTypeAvailable = true;
      component['editingFormGroup'] = {
        get: jest.fn().mockReturnValue({ value: true }),
      } as any;

      const relativeValue = 50;
      const absoluteValue = 75;

      const multiplyAndRoundValuesSpy = jest.spyOn(
        pricingUtils,
        'multiplyAndRoundValues'
      );
      multiplyAndRoundValuesSpy.mockReturnValue(absoluteValue);

      expect(component['determineAbsoluteValue'](relativeValue)).toBe(
        absoluteValue
      );
      expect(multiplyAndRoundValuesSpy).toHaveBeenCalledWith(
        (QUOTATION_DETAIL_MOCK as any)[testData.field],
        1 + relativeValue / 100
      );
    });
  });

  describe('hasChanges', () => {
    test('should have changes', () => {
      const testData = {
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
      };
      const currentValue = testData.quotationDetail.price + 25;

      component.modalData = testData;

      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockImplementation();

      component['determineAbsoluteValue'] = jest
        .fn()
        .mockReturnValue(currentValue);

      updateFormValue(currentValue.toString());

      expect(component.hasValueChanged).toBe(true);
    });

    test('should have no changes', () => {
      const testData = {
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
      };
      const currentValue = testData.quotationDetail.price;

      component.modalData = testData;

      jest.spyOn(miscUtils, 'parseLocalizedInputValue').mockImplementation();

      component['determineAbsoluteValue'] = jest
        .fn()
        .mockReturnValue(currentValue);

      updateFormValue(currentValue.toString());

      expect(component.hasValueChanged).toBe(false);
    });
  });
  describe('resetKpiValues', () => {
    test('should reset kpi values', () => {
      component.affectedKpis = [{ key: ColumnFields.PRICE, value: 1 }];
      component['resetKpiValues']();
      expect(component.affectedKpis).toEqual([
        { key: ColumnFields.PRICE, value: undefined },
      ]);
    });
  });
});
