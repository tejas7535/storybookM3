import { of, throwError } from 'rxjs';

import { Stub } from '../../../../../shared/test/stub.class';
import { CustomerSalesPlanShareEditModalComponent } from './customer-sales-plan-share-edit-modal.component';

describe('CustomerSalesPlanShareEditModalComponent', () => {
  let component: CustomerSalesPlanShareEditModalComponent;

  beforeEach(() => {
    component = Stub.get({
      component: CustomerSalesPlanShareEditModalComponent,
      providers: [
        Stub.getSalesPlanningServiceProvider(),
        Stub.getMatDialogDataProvider({
          apShareAdjustedUnconstrained: '20',
          apShareUnconstrained: '30',
          customerNumber: '000012345',
          opShareAdjustedUnconstrained: '40',
          opShareUnconstrained: '50',
          planningYear: '2023',
          spShareAdjustedUnconstrained: '60',
          spShareUnconstrained: '70',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form', () => {
    it('should initialize form controls with correct values', () => {
      expect(component['form'].controls['adjustedAPValue'].value).toBe('20');
      expect(component['form'].controls['calculatedAPValue'].value).toBe('30');
      expect(component['form'].controls['calculatedAPValue'].disabled).toBe(
        true
      );

      expect(component['form'].controls['adjustedOPValue'].value).toBe('40');
      expect(component['form'].controls['calculatedOPValue'].value).toBe('50');
      expect(component['form'].controls['calculatedOPValue'].disabled).toBe(
        true
      );

      expect(component['form'].controls['adjustedSPValue'].value).toBe('60');
      expect(component['form'].controls['calculatedSPValue'].value).toBe('70');
      expect(component['form'].controls['calculatedSPValue'].disabled).toBe(
        true
      );
    });

    it('should validate cross-field totals using crossFieldValidator', () => {
      component['form'].controls['adjustedAPValue'].setValue(30);
      component['form'].controls['adjustedOPValue'].setValue(30);
      component['form'].controls['adjustedSPValue'].setValue(30);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toBeNull(); // Assuming the total does not exceed the limit
    });

    it('should mark form as invalid if cross-field validation fails', () => {
      component['form'].controls['adjustedAPValue'].setValue(50);
      component['form'].controls['adjustedOPValue'].setValue(40);
      component['form'].controls['adjustedSPValue'].setValue(30);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toEqual({ totalExceedsLimit: true }); // Assuming the total exceeds the limit
    });

    it('should handle null values for adjusted fields gracefully', () => {
      component['form'].controls['adjustedAPValue'].setValue(null);
      component['form'].controls['adjustedOPValue'].setValue(null);
      component['form'].controls['adjustedSPValue'].setValue(null);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toBeNull(); // Assuming null values do not exceed the limit
    });
  });

  describe('onDelete', () => {
    it('should call deleteShares and close the dialog on success', () => {
      const deleteSharesSpy = jest
        .spyOn(component['salesPlanningService'], 'deleteShares')
        .mockReturnValue(of(null));
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['onDelete']();

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(deleteSharesSpy).toHaveBeenCalledWith('000012345', '2023');
      expect(closeSpy).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('should handle errors during deleteShares', () => {
      const deleteSharesSpy = jest
        .spyOn(component['salesPlanningService'], 'deleteShares')
        .mockReturnValue(throwError(() => new Error('Error')));
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['onDelete']();

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(deleteSharesSpy).toHaveBeenCalledWith('000012345', '2023');
      expect(closeSpy).not.toHaveBeenCalled();
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('onSave', () => {
    it('should call updateShares and close the dialog on success if form is valid', () => {
      const updateSharesSpy = jest
        .spyOn(component['salesPlanningService'], 'updateShares')
        .mockReturnValue(of(null));
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['form'].controls['adjustedAPValue'].setValue(15);
      component['form'].controls['adjustedOPValue'].setValue(15);
      component['form'].controls['adjustedSPValue'].setValue(15);

      component['onSave']();

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(updateSharesSpy).toHaveBeenCalledWith('000012345', '2023', {
        apShare: 15,
        spShare: 15,
        opShare: 15,
      });
      expect(closeSpy).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('should handle errors during updateShares', () => {
      const updateSharesSpy = jest
        .spyOn(component['salesPlanningService'], 'updateShares')
        .mockReturnValue(throwError(() => new Error('Error')));
      const snackbarSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['form'].controls['adjustedAPValue'].setValue(15);
      component['form'].controls['adjustedOPValue'].setValue(15);
      component['form'].controls['adjustedSPValue'].setValue(15);

      component['onSave']();

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(updateSharesSpy).toHaveBeenCalledWith('000012345', '2023', {
        apShare: 15,
        spShare: 15,
        opShare: 15,
      });
      expect(snackbarSpy).toHaveBeenCalledWith('Error');
      expect(closeSpy).not.toHaveBeenCalled();
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('should not call updateShares if form is invalid', () => {
      const updateSharesSpy = jest.spyOn(
        component['salesPlanningService'],
        'updateShares'
      );
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');

      component['form'].setValue({
        adjustedAPValue: null,
        calculatedAPValue: null,
        adjustedOPValue: null,
        calculatedOPValue: null,
        adjustedSPValue: null,
        calculatedSPValue: null,
      });

      component['form'].markAllAsTouched();
      component['form'].updateValueAndValidity();
      component['form'].setErrors({ invalid: true });

      component['onSave']();

      expect(updateSharesSpy).not.toHaveBeenCalled();
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should close the dialog with false', () => {
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');

      component['onCancel']();

      expect(closeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('crossFieldValidator', () => {
    it('should return null if the total does not exceed the limit', () => {
      component['form'].controls['adjustedAPValue'].setValue(30);
      component['form'].controls['adjustedOPValue'].setValue(30);
      component['form'].controls['adjustedSPValue'].setValue(30);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toBeNull(); // Total is within the limit
    });

    it('should return an error if the total exceeds the limit', () => {
      component['form'].controls['adjustedAPValue'].setValue(50);
      component['form'].controls['adjustedOPValue'].setValue(40);
      component['form'].controls['adjustedSPValue'].setValue(30);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toEqual({ totalExceedsLimit: true }); // Total exceeds the limit
    });

    it('should handle null values gracefully and return null', () => {
      component['form'].controls['adjustedAPValue'].setValue(null);
      component['form'].controls['adjustedOPValue'].setValue(null);
      component['form'].controls['adjustedSPValue'].setValue(null);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toBeNull(); // Null values do not exceed the limit
    });

    it('should handle a mix of valid and null values and return null if within the limit', () => {
      component['form'].controls['adjustedAPValue'].setValue(30);
      component['form'].controls['adjustedOPValue'].setValue(null);
      component['form'].controls['adjustedSPValue'].setValue(20);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toBeNull(); // Total is within the limit
    });

    it('should handle a mix of valid and null values and return an error if exceeding the limit', () => {
      component['form'].controls['adjustedAPValue'].setValue(60);
      component['form'].controls['adjustedOPValue'].setValue(null);
      component['form'].controls['adjustedSPValue'].setValue(50);

      const result = component['crossFieldValidator']()(component['form']);

      expect(result).toEqual({ totalExceedsLimit: true }); // Total exceeds the limit
    });
  });
});
