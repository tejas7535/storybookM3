import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

import { EMPTY, of } from 'rxjs';

import { Stub } from '../../../../../shared/test/stub.class';
import {
  AdjustmentOption,
  CustomerSalesPlanNumberAndPercentageEditModalComponent,
} from './customer-sales-plan-number-and-percentage-edit-modal.component';

describe('CustomerSalesPlanNumberAndPercentageEditModalComponent', () => {
  let component: CustomerSalesPlanNumberAndPercentageEditModalComponent;
  let mockDialogRef: Partial<
    MatDialogRef<CustomerSalesPlanNumberAndPercentageEditModalComponent>
  >;
  let updateSpy: jest.SpyInstance;
  let loadingSpy: jest.SpyInstance;
  const testValue = '1,000';

  const mockData = {
    title: 'Edit Sales Plan',
    planningCurrency: 'USD',
    previousValue: 100,
    formLabel: 'Adjustment Value',
    currentValueLabel: 'Current Value',
    previousValueLabel: 'Previous Value',
    onSave: jest.fn().mockReturnValue(EMPTY),
    onDelete: jest.fn().mockReturnValue(EMPTY),
    minValue: testValue,
    inputValidatorFn: jest.fn().mockReturnValue(null),
    inputValidatorErrorMessage: 'Invalid input',
  };

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() };

    component = Stub.get({
      component: CustomerSalesPlanNumberAndPercentageEditModalComponent,
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        Stub.getMatDialogDataProvider(mockData),
      ],
    });
    updateSpy = jest.spyOn(component as any, 'updateAdjustedValue');
    loadingSpy = jest.spyOn(component['loading'], 'set');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.controls.adjustmentOption.value).toBe(
      AdjustmentOption.Absolute
    );
    expect(component.form.controls.adjustedValue.value).toBeNull();
  });

  describe('validateInput', () => {
    it('should validate an input', () => {
      component['validateInput']({
        value: testValue,
      } as AbstractControl);
      expect(updateSpy).toHaveBeenCalledWith(testValue);
      expect(mockData.inputValidatorFn).toHaveBeenCalledWith(1000);
    });

    it('should not validate null values', () => {
      component['validateInput']({
        value: null,
      } as AbstractControl);
      expect(updateSpy).not.toHaveBeenCalled();
      expect(mockData.inputValidatorFn).not.toHaveBeenCalled();
    });

    it('should not validate empty strings', () => {
      component['validateInput']({
        value: '',
      } as AbstractControl);
      expect(updateSpy).not.toHaveBeenCalled();
      expect(mockData.inputValidatorFn).not.toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should delete the data and close the dialog', () => {
      mockData.onDelete.mockImplementation(() => of(true));
      component['onDelete']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(mockDialogRef.close).toHaveBeenCalledWith(-1);
      expect(loadingSpy).toHaveBeenLastCalledWith(false);
    });
  });

  describe('onCancel', () => {
    it('should close the dialog', () => {
      component['onCancel']();
      expect(mockDialogRef.close).toHaveBeenCalledWith(null);
    });
  });

  describe('onSave', () => {
    it('should save the data and close the dialog', () => {
      mockData.onSave.mockImplementation(() => of(true));
      component['form'].controls.adjustedValue.setValue(testValue);
      component['onSave']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(mockDialogRef.close).toHaveBeenCalledWith(1000);
      expect(loadingSpy).toHaveBeenLastCalledWith(false);
    });
  });

  describe('onChangeAdjustmentOption', () => {
    let inputControl: FormControl<string>;
    beforeEach(() => {
      inputControl = component.form.controls.adjustedValue;
    });
    it('should set the min value and disable the input', () => {
      const event = { value: AdjustmentOption.Minimum } as MatRadioChange;
      component['onChangeAdjustmentOption'](event);
      expect(inputControl.disabled).toBe(true);
      expect(inputControl.value).toBe(testValue);
      expect(component['isEnteringRelativeValue']()).toBe(false);
    });

    it('should set reset the value and enable the input', () => {
      const event = { value: AdjustmentOption.Absolute } as MatRadioChange;
      component['onChangeAdjustmentOption'](event);
      expect(inputControl.disabled).toBe(false);
      expect(inputControl.value).toBeNull();
      expect(component['isEnteringRelativeValue']()).toBe(false);
    });

    it('should set reset the value and enable the input and set to relative mode', () => {
      const event = { value: AdjustmentOption.Relative } as MatRadioChange;
      component['onChangeAdjustmentOption'](event);
      expect(inputControl.disabled).toBe(false);
      expect(inputControl.value).toBeNull();
      expect(component['isEnteringRelativeValue']()).toBe(true);
    });
  });

  describe('onInput', () => {
    it('should not set the value on input', () => {
      component.form.controls.adjustedValue.setValue(testValue);
      component['onInput']({} as Event);
      expect(updateSpy).toHaveBeenCalledWith(testValue);
    });

    it('should not set the value when input is empty', () => {
      component['onInput']({} as Event);

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('updateAdjustedValue', () => {
    it('should update the adjusted relative value', () => {
      component['updateAdjustedValue'](testValue);
      expect(component['configuredValue']()).toBe(1000);
    });
    it('should update the adjusted absolute value', () => {
      component['isEnteringRelativeValue'].set(true);
      component['updateAdjustedValue'](testValue);
      expect(component['configuredValue']()).toBe(1100);
    });
    it('should not update the adjusted absolute value for an invalid value', () => {
      component['isEnteringRelativeValue'].set(true);
      component['updateAdjustedValue']('ten');
      expect(component['configuredValue']()).toBeNull();
    });
  });
});
