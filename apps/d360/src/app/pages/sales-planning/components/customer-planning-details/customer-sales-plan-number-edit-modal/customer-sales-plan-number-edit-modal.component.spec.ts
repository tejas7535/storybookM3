import { of } from 'rxjs';

import { Stub } from './../../../../../shared/test/stub.class';
import { CustomerSalesPlanNumberEditModalComponent } from './customer-sales-plan-number-edit-modal.component';

describe('CustomerSalesPlanNumberEditModalComponent', () => {
  let component: CustomerSalesPlanNumberEditModalComponent;
  let dialogRefSpy: jest.SpyInstance;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerSalesPlanNumberEditModalComponent>({
      component: CustomerSalesPlanNumberEditModalComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getMatDialogDataProvider({
          title: 'Test Title',
          planningCurrency: 'EUR',
          previousValue: 1000,
          formLabel: 'Test Form Label',
          currentValueLabel: 'Current Value:',
          previousValueLabel: 'Previous Value:',
          referenceValueLabel: 'Reference Value:',
          previousReferenceValueLabel: 'Previous Reference Value:',
          referenceValue: 10_000,
          previousReferenceValue: 9000,
          calculateReferenceValue: jest
            .fn()
            .mockImplementation((value) => value * 1.5),
          onSave: () => of(0),
          onDelete: () => of(0),
        }),
      ],
    });
    dialogRefSpy = jest.spyOn(component['dialogRef'], 'close');

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should allow valid numbers', () => {
      component['form'].controls.adjustedValue.setValue('1500');

      expect(component['form'].valid).toBeTruthy();
      expect(component['configuredValue']()).toBe(1500);
      expect(component['calculatedReferenceValue']()).toBe(2250); // 1500 * 1.5
    });

    it('should validate negative numbers as invalid', () => {
      component['form'].controls.adjustedValue.setValue('-100');

      expect(component['form'].controls.adjustedValue.invalid).toBeTruthy();
      expect(component['form'].controls.adjustedValue.errors).toHaveProperty(
        'min'
      );
    });

    it('should allow empty input', () => {
      component['form'].controls.adjustedValue.setValue('');

      expect(component['form'].valid).toBeTruthy();
    });
  });

  describe('onDelete', () => {
    it('should call onDelete from data and close dialog with -1', () => {
      const onDeleteSpy = jest.spyOn(component['data'], 'onDelete');
      component['onDelete']();

      Stub.detectChanges();

      expect(component['loading']()).toBe(false);
      expect(onDeleteSpy).toHaveBeenCalled();
      expect(dialogRefSpy).toHaveBeenCalledWith(-1);
    });
  });

  describe('onCancel', () => {
    it('should close the dialog with null', () => {
      component['onCancel']();

      expect(dialogRefSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('onSave', () => {
    it('should not save when form is invalid', () => {
      component['form'].controls.adjustedValue.setValue('-100'); // Invalid value
      const onSaveSpy = jest.spyOn(component['data'], 'onSave');

      component['onSave']();

      expect(component['form'].controls.adjustedValue.touched).toBeTruthy();
      expect(onSaveSpy).not.toHaveBeenCalled();
      expect(dialogRefSpy).not.toHaveBeenCalled();
    });

    it('should not save when adjustedValue is null', () => {
      component['form'].controls.adjustedValue.setValue(null);
      const onSaveSpy = jest.spyOn(component['data'], 'onSave');

      component['onSave']();

      expect(onSaveSpy).not.toHaveBeenCalled();
      expect(dialogRefSpy).not.toHaveBeenCalled();
    });

    it('should save when form is valid', () => {
      component['form'].controls.adjustedValue.setValue('2000');
      const onSaveSpy = jest
        .spyOn(component['data'], 'onSave')
        .mockReturnValue(of(0 as any));

      component['onSave']();

      expect(component['loading']()).toBe(false);
      expect(onSaveSpy).toHaveBeenCalledWith(2000);
      expect(dialogRefSpy).toHaveBeenCalledWith(2000);
    });
  });

  describe('onInput', () => {
    it('should update values when valid input is provided', () => {
      const mockEvent = new Event('input');
      component['form'].controls.adjustedValue.setValue('3000');

      component['onInput'](mockEvent);

      expect(component['configuredValue']()).toBe(3000);
      expect(component['calculatedReferenceValue']()).toBe(4500); // 3000 * 1.5
    });

    it('should not update values when input is empty', () => {
      const mockEvent = new Event('input');
      component['form'].controls.adjustedValue.setValue('');

      component['onInput'](mockEvent);

      expect(component['configuredValue']()).toBeNull();
      expect(component['calculatedReferenceValue']()).toBeNull();
    });
  });

  describe('updateAdjustedValue', () => {
    it('should update configuredValue and calculatedReferenceValue when valid input', () => {
      // Access private method through the public interface
      component['form'].controls.adjustedValue.setValue('5000');
      component['onInput'](new Event('input'));

      expect(component['configuredValue']()).toBe(5000);
      expect(component['calculatedReferenceValue']()).toBe(7500); // 5000 * 1.5
    });

    it('should not update values when invalid number format', () => {
      // Setting invalid number to test number validation
      jest.spyOn(Number, 'isFinite').mockReturnValueOnce(false);

      component['form'].controls.adjustedValue.setValue('invalid');
      component['onInput'](new Event('input'));

      expect(component['configuredValue']()).toBeNull();
      expect(component['calculatedReferenceValue']()).toBeNull();
    });
  });
});
