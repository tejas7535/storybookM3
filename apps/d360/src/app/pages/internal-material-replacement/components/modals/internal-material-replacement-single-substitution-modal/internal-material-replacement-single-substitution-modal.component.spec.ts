import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { of } from 'rxjs';

import * as ValidateFormDecorator from '../../../../../shared/decorators';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { Stub } from './../../../../../shared/test/stub.class';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from './internal-material-replacement-single-substitution-modal.component';

jest.mock('../../../../../shared/decorators', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../shared/decorators'),
  ValidateForm: jest.fn(),
}));

describe('InternalMaterialReplacementSingleSubstitutionModalComponent', () => {
  let component: InternalMaterialReplacementSingleSubstitutionModalComponent;

  beforeEach(() => {
    component = Stub.get({
      component: InternalMaterialReplacementSingleSubstitutionModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          isNewSubstitution: true,
          substitution: {
            replacementType: 'RELOCATION',
            region: null,
            salesArea: null,
            salesOrg: null,
            customerNumber: null,
            replacementDate: null,
            startOfProduction: null,
            cutoverDate: null,
            note: null,
            predecessorMaterial: null,
            successorMaterial: null,
          },
          gridApi: { applyServerSideTransaction: jest.fn() } as any,
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the component with isNewSubstitution = true', () => {
      jest
        .spyOn(component as any, 'getReplacementTypeLogic')
        .mockImplementation(() => ({
          replacementType: 'RELOCATION',
          mandatoryFields: [],
          deactivatedFields: [],
        }));
      const spy1 = jest.spyOn(component as any, 'enableAllFields');
      const spy2 = jest.spyOn(component as any, 'setInitialValues');
      const spy3 = jest.spyOn(
        component as any,
        'disableAllFieldsExceptReplacementType'
      );
      const spy4 = jest.spyOn(
        component['successorMaterialControl'],
        'updateValueAndValidity'
      );
      const spy5 = jest.spyOn(
        component['predecessorMaterialControl'],
        'updateValueAndValidity'
      );

      component.ngOnInit();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();

      component['predecessorMaterialControl'].setValue('abc', {
        emitEvent: true,
      });
      component['successorMaterialControl'].setValue('abc', {
        emitEvent: true,
      });
      expect(spy4).toHaveBeenCalledWith({ emitEvent: true });
      expect(spy5).toHaveBeenCalledWith({ emitEvent: true });
    });

    it('should initialize the component with isNewSubstitution = false', () => {
      jest
        .spyOn(component as any, 'getReplacementTypeLogic')
        .mockImplementation(() => ({
          replacementType: null,
          mandatoryFields: [],
          deactivatedFields: [],
        }));
      component['data'].isNewSubstitution = false;
      const spy1 = jest.spyOn(component as any, 'setDisabledFields');
      const spy2 = jest.spyOn(component as any, 'configureRequiredFields');
      const spy3 = jest.spyOn(
        component as any,
        'disableAllFieldsExceptReplacementType'
      );

      component.ngOnInit();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();
    });
  });

  describe('setInitialValues', () => {
    it('should set initial values in the form', () => {
      const spy = jest.spyOn(component['formGroup'], 'patchValue');
      component['setInitialValues']();
      expect(spy).toHaveBeenCalledWith(expect.any(Object), {
        emitEvent: false,
      });
    });
  });

  describe('setDisabledFields', () => {
    it('should disable fields based on replacement type logic', () => {
      const spy1 = jest.spyOn(component['formGroup'], 'get');
      const spy2 = jest
        .spyOn(component as any, 'getReplacementTypeLogic')
        .mockReturnValue({ deactivatedFields: ['region'] });

      component['setDisabledFields']();
      expect(spy1).toHaveBeenCalled();

      expect(component['formGroup'].get('region').disabled).toBe(true);

      spy2.mockRestore();
    });
  });

  describe('getReplacementTypeLogic', () => {
    it('should return empty ReplacementTypeLogic data', () => {
      component['formGroup'].get('replacementType').setValue({ id: null });
      const result = component['getReplacementTypeLogic']();

      expect(result).toEqual({
        replacementType: null,
        mandatoryFields: [],
        deactivatedFields: [],
      });
    });

    it('should return the correct ReplacementTypeLogic data', () => {
      component['formGroup']
        .get('replacementType')
        .setValue({ id: 'RELOCATION' });

      const result = component['getReplacementTypeLogic']();

      expect(result).toEqual({
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'customerNumber',
          'replacementDate',
        ],
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'startOfProduction',
          'cutoverDate',
        ],
        replacementType: 'RELOCATION',
      });
    });
  });

  describe('resetModal', () => {
    it('should reset the modal form fields, expect replacementType and region', () => {
      component['formGroup']
        .get('replacementType')
        .setValue({ id: 'RELOCATION' });
      component['formGroup'].get('region').setValue({ id: 'EU' });
      component['formGroup'].get('note').setValue('abc');

      component['resetModal']();

      expect(
        component['formGroup'].get('replacementType').getRawValue()
      ).toEqual({ id: 'RELOCATION' });
      expect(component['formGroup'].get('region').getRawValue()).toEqual({
        id: 'EU',
      });
      expect(component['formGroup'].get('note').getRawValue()).toBeNull();
    });
  });

  describe('keepMaterialOnPackagingChange', () => {
    let validatorFn: ValidatorFn;

    beforeEach(() => {
      validatorFn =
        component['keepMaterialOnPackagingChange']('successorMaterial');
    });

    it('should return validation error if replacementType is PACKAGING_CHANGE and materials do not match', () => {
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        successorMaterial: new FormControl({ id: 'material2' }),
        materialControl: new FormControl({ id: 'material1' }),
      });

      const result = validatorFn(formGroup.get('materialControl'));

      expect(result).toEqual({ keepMaterialOnPackagingChange: true });
      expect(component['materialCustomErrorMessage']()).toBe(
        'sap_message./SGD/SCM_SOP_SALES.107'
      );
    });

    it('should return null if replacementType is PACKAGING_CHANGE and materials match', () => {
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        successorMaterial: new FormControl({ id: 'material1' }),
        materialControl: new FormControl({ id: 'material1' }),
      });

      const result = validatorFn(formGroup.get('materialControl'));

      expect(result).toBeNull();
      expect(component['materialCustomErrorMessage']()).toBeNull();
    });

    it('should return null if replacementType is not PACKAGING_CHANGE', () => {
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'OTHER_TYPE' }),
        successorMaterial: new FormControl({ id: 'material2' }),
        materialControl: new FormControl({ id: 'material1' }),
      });

      const result = validatorFn(formGroup.get('materialControl'));

      expect(result).toBeNull();
      expect(component['materialCustomErrorMessage']()).toBeNull();
    });

    it('should handle undefined materialControl gracefully', () => {
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        successorMaterial: new FormControl({ id: 'material2' }),
      });

      const result = validatorFn(formGroup.get('nonExistentControl'));

      expect(result).toBeNull();
      expect(component['materialCustomErrorMessage']()).toBeNull();
    });

    it('should correctly handle material numbers longer than 13 characters', () => {
      const formGroup = new FormGroup({
        replacementType: new FormControl({ id: 'PACKAGING_CHANGE' }),
        successorMaterial: new FormControl({ id: '1234567890123' }),
        materialControl: new FormControl({ id: '1234567890123-456' }),
      });

      const result = validatorFn(formGroup.get('materialControl'));

      expect(result).toBeNull();
      expect(component['materialCustomErrorMessage']()).toBeNull();
    });
  });

  describe('cutoverDateBeforeSOP', () => {
    it('should return validation error if cutover date is after start of production', () => {
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-02-15')),
        startOfProduction: new FormControl(new Date('2025-02-14')),
      });

      const result = component['cutoverDateBeforeSOP']()(formGroup);

      expect(result).toEqual({ endDate: ['end-before-start'] });
    });

    it('should return null if cutover date is before start of production', () => {
      const formGroup = new FormGroup({
        cutoverDate: new FormControl(new Date('2025-02-13')),
        startOfProduction: new FormControl(new Date('2025-02-14')),
      });
      const result = component['cutoverDateBeforeSOP']()(formGroup);
      expect(result).toBeNull();
    });
  });

  describe('updateForm', () => {
    it('should call nothing, if no event', () => {
      const spy1 = jest.spyOn(component as any, 'enableAllFields');
      const spy2 = jest.spyOn(component as any, 'setDisabledFields');
      const spy3 = jest.spyOn(component as any, 'configureRequiredFields');
      const spy4 = jest.spyOn(component as any, 'resetModal');

      component['updateForm'](null);

      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();
    });

    it('should call reset, if event is given', () => {
      component['data'].isNewSubstitution = true;

      const spy1 = jest
        .spyOn(component as any, 'enableAllFields')
        .mockImplementation(() => {});
      const spy2 = jest
        .spyOn(component as any, 'setDisabledFields')
        .mockImplementation(() => {});
      const spy3 = jest
        .spyOn(component as any, 'configureRequiredFields')
        .mockImplementation(() => {});
      const spy4 = jest
        .spyOn(component as any, 'resetModal')
        .mockImplementation(() => {});

      component['updateForm'](true);

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
    });
  });

  describe('onSave', () => {
    it('should show snackbar if form is invalid', () => {
      component['formGroup'].setValue({
        replacementType: null,
        region: null,
        salesArea: null,
        salesOrg: null,
        customerNumber: null,
        replacementDate: null,
        startOfProduction: null,
        cutoverDate: null,
        note: null,
        predecessorMaterial: null,
        successorMaterial: null,
      } as any);
      component['formGroup'].setErrors({
        replacementType: { invalid: true },
      });
      component['formGroup'].markAllAsTouched();

      jest
        .spyOn(ValidateFormDecorator, 'ValidateForm')
        .mockImplementation(
          (_formName: string) => (_target: any, _key: any, descriptor: any) =>
            descriptor
        );
      jest.spyOn(component['snackbarService'], 'openSnackBar');

      component['formGroup'].setErrors({ invalid: true });
      component['onSave']();

      expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
        'generic.validation.check_inputs'
      );
    });

    it('should call saveSingleIMRSubstitution if form is valid', () => {
      component['formGroup'].setValue({
        replacementType: { id: 'RELOCATION', text: 'RELOCATION' },
        region: null,
        salesArea: null,
        salesOrg: null,
        customerNumber: null,
        replacementDate: null,
        startOfProduction: null,
        cutoverDate: null,
        note: null,
        predecessorMaterial: null,
        successorMaterial: null,
      } as any);

      const spy1 = jest
        .spyOn(component['iMRService'], 'saveSingleIMRSubstitution')
        .mockReturnValue(
          of({
            overallStatus: MessageType.Success,
            overallErrorMsg: '',
            response: [],
          })
        );

      jest.spyOn(component as any, 'handleOnClose');
      jest.spyOn(component['snackbarService'], 'openSnackBar');

      component['onSave']();

      expect(
        component['iMRService'].saveSingleIMRSubstitution
      ).toHaveBeenCalled();
      expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
        'customer_material_portfolio.phase_in_out_single_modal.save.success'
      );

      spy1.mockRestore();
    });
  });

  describe('handleOnClose', () => {
    it('should close the dialog with the provided value', () => {
      const spy1 = jest.spyOn(component as any, 'resetModal');
      const spy2 = jest.spyOn(component['dialogRef'], 'close');

      component['handleOnClose'](true, {} as any);

      expect(spy1).toHaveBeenCalledWith();
      expect(spy2).toHaveBeenCalledWith({
        reloadData: true,
        redefinedSubstitution: {},
      });
    });
  });

  describe('validateAgainstExistingDate', () => {
    it('should validate date against existing date', () => {
      const validatorFn = component['validateAgainstExistingDate'](
        new Date(),
        component['replacementDateCustomErrorMessage']
      );
      const control = { value: new Date(), setErrors: jest.fn() } as any;
      const result = validatorFn(control);
      expect(result).toBeNull();
    });

    it('should return null when current date is equal to pre-filled date', () => {
      const today = new Date();
      const errorMessageSignal = component['cutoverDateCustomErrorMessage'];
      const validatorFn = component['validateAgainstExistingDate'](
        today,
        errorMessageSignal
      );

      const control = new FormControl(today);
      const result = validatorFn(control);

      expect(result).toBeNull();
      expect(errorMessageSignal()).toBeNull();
    });

    it('should return error when date is before today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const preFilledDate = new Date();
      preFilledDate.setDate(preFilledDate.getDate() + 10);

      const errorMessageSignal = component['cutoverDateCustomErrorMessage'];
      const validatorFn = component['validateAgainstExistingDate'](
        preFilledDate,
        errorMessageSignal
      );

      const control = new FormControl(yesterday);
      const result = validatorFn(control);

      expect(result).toEqual({ customDatepickerMin: true });
      expect(errorMessageSignal()).toContain(
        'error.date.beforeMinEditingExistingRecord'
      );
    });

    it('should return error when date is after MAX_DATE', () => {
      const futureDate = new Date(10_000, 1, 1); // Date far in the future
      const preFilledDate = new Date();

      const errorMessageSignal = component['cutoverDateCustomErrorMessage'];
      const validatorFn = component['validateAgainstExistingDate'](
        preFilledDate,
        errorMessageSignal
      );

      const control = new FormControl(futureDate);
      const result = validatorFn(control);

      expect(result).toEqual({ customDatepickerMax: true });
      expect(errorMessageSignal()).toContain(
        'error.date.afterMaxEditingExistingRecord'
      );
    });

    it('should return null for null date value', () => {
      const preFilledDate = new Date();
      const errorMessageSignal = component['cutoverDateCustomErrorMessage'];
      const validatorFn = component['validateAgainstExistingDate'](
        preFilledDate,
        errorMessageSignal
      );

      const control = new FormControl(null);
      const result = validatorFn(control);

      expect(result).toBeNull();
      expect(errorMessageSignal()).toBeNull();
    });
  });

  describe('getDateOrNull', () => {
    it('should return date or null', () => {
      const date = component['getDateOrNull']('2025-02-14' as any);
      expect(date).toBeInstanceOf(Date);
    });

    it('should return Date object when valid Date is provided', () => {
      const date = new Date(2023, 5, 15);
      const result = component['getDateOrNull'](date);
      expect(result).toEqual(date);
    });

    it('should return Date object when valid date string is provided', () => {
      const result = component['getDateOrNull']('2023-06-15' as any);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
    });

    it('should return null when null is provided', () => {
      const result = component['getDateOrNull'](null);
      expect(result).toBeNull();
    });

    it('should return null when empty string is provided', () => {
      const result = component['getDateOrNull']('' as any);
      expect(result).toBeNull();
    });
  });

  describe('disableAllFieldsExceptReplacementType', () => {
    it('should disable all fields except replacement type', () => {
      const spy = jest.spyOn(component['formGroup'], 'get');
      component['disableAllFieldsExceptReplacementType']();
      expect(spy).toHaveBeenCalled();
    });

    it('should disable all fields except replacementType', () => {
      component['disableAllFieldsExceptReplacementType']();

      expect(component['formGroup'].get('replacementType').disabled).toBe(
        false
      );
      expect(component['formGroup'].get('region').disabled).toBe(true);
      expect(component['formGroup'].get('successorMaterial').disabled).toBe(
        true
      );
      expect(component['formGroup'].get('predecessorMaterial').disabled).toBe(
        true
      );
      expect(component['formGroup'].get('note').disabled).toBe(true);
    });
  });

  describe('enableAllFields', () => {
    it('should enable all fields', () => {
      const spy = jest.spyOn(component['formGroup'], 'get');
      component['enableAllFields']();
      expect(spy).toHaveBeenCalled();
    });

    it('should enable all fields in the form', () => {
      // First disable fields
      component['disableAllFieldsExceptReplacementType']();

      // Then enable all
      component['enableAllFields']();

      // Check all fields are enabled
      Object.keys(component['formGroup'].controls).forEach((key) => {
        expect(component['formGroup'].get(key).disabled).toBe(false);
      });
    });
  });

  describe('configureRequiredFields', () => {
    it('should configure required fields based on replacement type logic', () => {
      component['formGroup']
        .get('replacementType')
        .setValue({ id: 'RELOCATION' });

      const spy = jest.spyOn(component['formGroup'], 'get');

      component['configureRequiredFields']();

      expect(spy).toHaveBeenCalled();
    });

    it('should set required validators based on the replacement type logic', () => {
      jest.spyOn(component as any, 'getReplacementTypeLogic').mockReturnValue({
        replacementType: 'TEST_TYPE',
        mandatoryFields: ['region', 'note'],
        deactivatedFields: [],
      });

      component['configureRequiredFields']();

      expect(
        component['formGroup'].get('region').hasValidator(Validators.required)
      ).toBe(true);
      expect(
        component['formGroup'].get('note').hasValidator(Validators.required)
      ).toBe(true);
      expect(
        component['formGroup']
          .get('customerNumber')
          .hasValidator(Validators.required)
      ).toBe(false);
    });
  });

  describe('setOrRemoveRequired', () => {
    it('should set or remove required validator', () => {
      const control = new FormControl();
      component['setOrRemoveRequired'](true, control);
      expect(control.hasValidator(Validators.required)).toBeTruthy();
    });

    it('should add required validator when required is true', () => {
      const control = new FormControl('test');
      const addValidatorsSpy = jest.spyOn(control, 'addValidators');
      const removeValidatorsSpy = jest.spyOn(control, 'removeValidators');
      const updateValueAndValiditySpy = jest.spyOn(
        control,
        'updateValueAndValidity'
      );

      component['setOrRemoveRequired'](true, control);

      expect(addValidatorsSpy).toHaveBeenCalledWith(Validators.required);
      expect(removeValidatorsSpy).not.toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalledWith({
        emitEvent: true,
      });
      expect(control.hasValidator(Validators.required)).toBeTruthy();
    });

    it('should remove required validator when required is false', () => {
      const control = new FormControl('test', Validators.required);
      const addValidatorsSpy = jest.spyOn(control, 'addValidators');
      const removeValidatorsSpy = jest.spyOn(control, 'removeValidators');
      const updateValueAndValiditySpy = jest.spyOn(
        control,
        'updateValueAndValidity'
      );

      component['setOrRemoveRequired'](false, control);

      expect(addValidatorsSpy).not.toHaveBeenCalled();
      expect(removeValidatorsSpy).toHaveBeenCalledWith(Validators.required);
      expect(updateValueAndValiditySpy).toHaveBeenCalledWith({
        emitEvent: true,
      });
      expect(control.hasValidator(Validators.required)).toBeFalsy();
    });

    it('should handle undefined control gracefully', () => {
      // This test verifies that the method doesn't throw errors with undefined control
      expect(() => {
        component['setOrRemoveRequired'](true, undefined as any);
      }).not.toThrow();
    });
  });
});
