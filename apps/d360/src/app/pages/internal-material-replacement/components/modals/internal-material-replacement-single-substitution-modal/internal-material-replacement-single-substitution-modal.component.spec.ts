import { of } from 'rxjs';

import * as ValidateFormDecorator from '../../../../../shared/decorators';
import { IMRValidatorsService } from '../../../services/imr-validators.service';
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
  let mockIMRValidatorsService: Partial<IMRValidatorsService>;

  beforeEach(() => {
    mockIMRValidatorsService = {
      keepMaterialOnPackagingChange: jest
        .fn()
        .mockReturnValue((): null => null),
      cutoverDateBeforeSOP: jest.fn().mockReturnValue((): null => null),
      replacementBeforeCutoverDate: jest.fn().mockReturnValue((): null => null),
      validateAgainstExistingDate: jest.fn().mockReturnValue((): null => null),
      setOrRemoveRequired: jest.fn(),
    };

    component = Stub.get({
      component: InternalMaterialReplacementSingleSubstitutionModalComponent,
      providers: [
        {
          provide: IMRValidatorsService,
          useValue: mockIMRValidatorsService,
        },
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
      jest.spyOn(component['snackbarService'], 'error');

      component['formGroup'].setErrors({ invalid: true });
      component['onSave']();

      expect(component['snackbarService'].error).toHaveBeenCalledWith(
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
      jest.spyOn(component['snackbarService'], 'show');

      component['onSave']();

      expect(
        component['iMRService'].saveSingleIMRSubstitution
      ).toHaveBeenCalled();
      expect(component['snackbarService'].show).toHaveBeenCalledWith(
        'customer_material_portfolio.phase_in_out_single_modal.save.success',
        undefined,
        undefined,
        'success'
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

    it('should call imrValidatorsService.setOrRemoveRequired for each form control', () => {
      jest.spyOn(component as any, 'getReplacementTypeLogic').mockReturnValue({
        replacementType: 'TEST_TYPE',
        mandatoryFields: ['region', 'note'],
        deactivatedFields: [],
      });

      const spy = jest.spyOn(mockIMRValidatorsService, 'setOrRemoveRequired');

      component['configureRequiredFields']();

      expect(spy).toHaveBeenCalledWith(
        false,
        component['formGroup'].get('replacementType')
      );
      expect(spy).toHaveBeenCalledWith(
        true,
        component['formGroup'].get('region')
      );
      expect(spy).toHaveBeenCalledWith(
        true,
        component['formGroup'].get('note')
      );
      expect(spy).toHaveBeenCalledWith(
        false,
        component['formGroup'].get('customerNumber')
      );
    });
  });

  describe('form validation integration', () => {
    it('should use imrValidatorsService for predecessor material validation', () => {
      expect(
        mockIMRValidatorsService.keepMaterialOnPackagingChange
      ).toHaveBeenCalledWith(
        'successorMaterial',
        component['materialCustomErrorMessage']
      );
    });

    it('should use imrValidatorsService for successor material validation', () => {
      expect(
        mockIMRValidatorsService.keepMaterialOnPackagingChange
      ).toHaveBeenCalledWith(
        'predecessorMaterial',
        component['materialCustomErrorMessage']
      );
    });

    it('should use imrValidatorsService for replacementBeforeCutoverDate validation', () => {
      expect(
        mockIMRValidatorsService.replacementBeforeCutoverDate
      ).toHaveBeenCalledWith(component['replacementDateCustomErrorMessage']);
    });

    it('should use imrValidatorsService for form group validation when not new substitution', () => {
      component['data'].isNewSubstitution = false;

      // Recreate component to trigger validator setup
      component = Stub.get({
        component: InternalMaterialReplacementSingleSubstitutionModalComponent,
        providers: [
          {
            provide: IMRValidatorsService,
            useValue: mockIMRValidatorsService,
          },
          Stub.getMatDialogDataProvider({
            isNewSubstitution: false,
            substitution: {
              replacementType: 'RELOCATION',
              region: null,
              salesArea: null,
              salesOrg: null,
              customerNumber: null,
              replacementDate: new Date(),
              startOfProduction: new Date(),
              cutoverDate: new Date(),
              note: null,
              predecessorMaterial: null,
              successorMaterial: null,
            },
            gridApi: { applyServerSideTransaction: jest.fn() } as any,
          }),
        ],
      });
      expect(
        mockIMRValidatorsService.cutoverDateBeforeSOP
      ).toHaveBeenCalledWith(component['startOfProductionCustomErrorMessage']);
      expect(
        mockIMRValidatorsService.validateAgainstExistingDate
      ).toHaveBeenCalled();
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
});
