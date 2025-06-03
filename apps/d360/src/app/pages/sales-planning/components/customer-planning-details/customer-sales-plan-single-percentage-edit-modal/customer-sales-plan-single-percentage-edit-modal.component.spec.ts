import { of } from 'rxjs';

import { Stub } from './../../../../../shared/test/stub.class';
import {
  CustomerSalesPlanNumberEditModalProps,
  CustomerSalesPlanSinglePercentageEditModalComponent,
} from './customer-sales-plan-single-percentage-edit-modal.component';

describe('CustomerSalesPlanSinglePercentageEditModalComponent', () => {
  let component: CustomerSalesPlanSinglePercentageEditModalComponent;

  let onSaveSpy: jest.SpyInstance;
  let onDeleteSpy: jest.SpyInstance;

  const mockData: CustomerSalesPlanNumberEditModalProps = {
    title: 'Edit Percentage',
    planningCurrency: 'USD',
    previousValue: 10,
    formLabel: 'Adjustment Value',
    currentValueLabel: 'Current Value',
    previousValueLabel: 'Previous Value',
    referenceValueLabel: 'Reference Value',
    previousReferenceValueLabel: 1000,
    referenceValue: 1000,
    previousReferenceValue: 900,
    onSave: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerSalesPlanSinglePercentageEditModalComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getMatDialogDataProvider(mockData),
      ],
    });

    onSaveSpy = jest.spyOn(mockData, 'onSave').mockReturnValue(of(true as any));
    onDeleteSpy = jest
      .spyOn(mockData, 'onDelete')
      .mockReturnValue(of(true as any));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should mark form as invalid when no value is provided', () => {
      component.form.controls.adjustedPercentage.setValue(null);
      expect(component.form.valid).toBeFalsy();
    });

    it('should mark form as valid when a valid percentage is provided', () => {
      component.form.controls.adjustedPercentage.setValue('50');
      expect(component.form.valid).toBeTruthy();
    });

    it('should return error when percentage is greater than 100', () => {
      component.form.controls.adjustedPercentage.setValue('150');
      expect(component.form.controls.adjustedPercentage.errors).toHaveProperty(
        'max'
      );
    });

    it('should return error when percentage is less than 0', () => {
      component.form.controls.adjustedPercentage.setValue('-10');
      expect(component.form.controls.adjustedPercentage.errors).toHaveProperty(
        'min'
      );
    });
  });

  describe('onSave', () => {
    it('should not call onSave when form is invalid', () => {
      component.form.controls.adjustedPercentage.setValue(null);
      component['onSave']();
      expect(onSaveSpy).not.toHaveBeenCalled();
    });

    it('should call onSave with adjusted percentage when form is valid', () => {
      component.form.controls.adjustedPercentage.setValue('25');
      component['onSave']();
      expect(onSaveSpy).toHaveBeenCalledWith(25);
    });

    it('should close dialog with adjusted percentage when save is successful', () => {
      const dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');
      component.form.controls.adjustedPercentage.setValue('25');
      component.adjustedPercentage.set(25);
      component['onSave']();
      expect(dialogRefSpy).toHaveBeenCalledWith(25);
    });

    it('should set loading to true while saving', () => {
      const loadingSpy = jest.spyOn(component.loading, 'set');
      component.form.controls.adjustedPercentage.setValue('25');
      component['onSave']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onDelete', () => {
    it('should call onDelete method from data', () => {
      component['onDelete']();
      expect(onDeleteSpy).toHaveBeenCalled();
    });

    it('should close dialog with 0 when delete is successful', () => {
      const dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');
      component['onDelete']();
      expect(dialogRefSpy).toHaveBeenCalledWith(0);
    });

    it('should set loading to true while deleting', () => {
      const loadingSpy = jest.spyOn(component.loading, 'set');
      component['onDelete']();
      expect(loadingSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onCancel', () => {
    it('should close dialog with null', () => {
      const dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');
      component['onCancel']();
      expect(dialogRefSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('onInput', () => {
    it('should update percentage value when input changes', () => {
      const event = new Event('input');
      component.form.controls.adjustedPercentage.setValue('30');
      const updateSpy = jest.spyOn(component as any, 'updatePercentageValue');

      component.onInput(event);

      expect(updateSpy).toHaveBeenCalledWith('30');
    });

    it('should not update percentage value when input is empty', () => {
      const event = new Event('input');
      component.form.controls.adjustedPercentage.setValue('');
      const updateSpy = jest.spyOn(component as any, 'updatePercentageValue');

      component.onInput(event);

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('updatePercentageValue', () => {
    it('should calculate reference value based on percentage', () => {
      component['updatePercentageValue']('20');

      expect(component.adjustedPercentage()).toBe(20);
      // If reference value is 1000 and percentage is 20%, the calculated value should be 800
      expect(component.calculatedReferenceValue()).toBe(800);
    });

    it('should handle non-numeric input', () => {
      jest
        .spyOn(component['translocoLocaleService'], 'getLocale')
        .mockReturnValue('en-US');
      const setCalculatedSpy = jest.spyOn(
        component.calculatedReferenceValue,
        'set'
      );

      component['updatePercentageValue']('abc');

      expect(setCalculatedSpy).not.toHaveBeenCalled();
    });

    it('should round the calculated reference value', () => {
      // Using a percentage that would result in a non-integer
      component['updatePercentageValue']('33.33');

      // 1000 * (1 - 33.33/100) = 666.7, rounded to 667
      expect(component.calculatedReferenceValue()).toBe(667);
    });
  });
});
