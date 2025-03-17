import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EMPTY, of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { CMPData } from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import {
  CMPChangeModalFlavor,
  CMPModal,
  CMPSpecificModal,
} from '../../table/status-actions';
import { DemandPlanAdoption } from './../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { Stub } from './../../../../../shared/test/stub.class';
import {
  CustomerMaterialSingleModalComponent,
  SpecificModalContentType,
} from './customer-material-single-modal.component';

describe('CustomerMaterialSingleModalComponent', () => {
  let component: CustomerMaterialSingleModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerMaterialSingleModalComponent,
      providers: [
        MockProvider(HttpClient),
        MockProvider(MAT_DIALOG_DATA, {
          data: {
            customerNumber: '42',
            materialNumber: '456',
            materialDescription: 'abc',
            demandCharacteristic: 'SE',
            portfolioStatus: 'SE',
            autoSwitchDate: null,
            repDate: null,
            successorMaterial: null,
            demandPlanAdoption: null,
          },
          modal: CMPSpecificModal.SUBSTITUTION_PROPOSAL,
          type: SpecificModalContentType.PhaseIn,
          edit: false,
          description: null,
          title: 'any title',
        }),
      ],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('ngOnInit', () => {
    it('should set formGroup values if data is provided', () => {
      const mockData = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'Test Characteristic',
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: 'SI',
        successorMaterial: null,
        demandPlanAdoption: null,
      } as any;

      component['data'].data = mockData;
      component.ngOnInit();

      expect(component['formGroup'].value).toEqual({
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'Test Characteristic',
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: 'SI',
        successorMaterial: null,
        demandPlanAdoption: null,
      } as any);
    });

    it('should call setConfirmation if modal is SCHAEFFLER_SUBSTITUTION', () => {
      const setConfirmationSpy = jest.spyOn(
        component as any,
        'setConfirmation'
      );
      component['data'].modal = CMPSpecificModal.SCHAEFFLER_SUBSTITUTION;
      component.ngOnInit();

      expect(setConfirmationSpy).toHaveBeenCalled();
    });

    it('should call setFormGroup if modal is not SCHAEFFLER_SUBSTITUTION', () => {
      const setFormGroupSpy = jest.spyOn(component as any, 'setFormGroup');
      component['data'].modal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;
      component.ngOnInit();

      expect(setFormGroupSpy).toHaveBeenCalled();
    });
  });

  describe('getRequestData', () => {
    it('should construct request data correctly', () => {
      component['formGroup'].setValue({
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'Test Characteristic',
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: 'SI',
        successorMaterial: null,
        demandPlanAdoption: null,
      });

      const requestData = component['getRequestData']();

      expect(requestData).toEqual({
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'Test Characteristic',
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: 'SI',
        successorMaterial: null,
        demandPlanAdoption: null,
      });
    });

    it('should handle SelectableValue correctly', () => {
      component['formGroup'].setValue({
        customerNumber: '123',
        materialNumber: { id: '456', name: 'Material' },
        materialDescription: 'Test Material',
        demandCharacteristic: 'Test Characteristic',
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: null,
        successorMaterial: null,
        demandPlanAdoption: null,
      });

      const requestData = component['getRequestData']();

      expect(requestData.materialNumber).toEqual({
        id: '456',
        name: 'Material',
      });
    });
  });

  describe('onSave', () => {
    it('should call save$ method when form is valid', () => {
      component['data'].type = SpecificModalContentType.NoContent;

      component['setFormGroup']();

      component['formGroup'].setValue({
        customerNumber: '123',
        materialNumber: 'asd123',
        materialDescription: null,
        demandCharacteristic: 'SI',
        autoSwitchDate: new Date(),
        repDate: null,
        portfolioStatus: null,
        successorMaterial: null,
        demandPlanAdoption: null,
      });

      const saveSpy = jest
        .spyOn(component as any, 'save$')
        .mockReturnValue(of({}));

      component['onSave'](null);

      expect(saveSpy).toHaveBeenCalled();
    });

    it('should not call save$ method when form is invalid', () => {
      component['formGroup'].setValue({
        customerNumber: null,
        materialNumber: null,
        materialDescription: null,
        demandCharacteristic: null,
        autoSwitchDate: null,
        repDate: null,
        portfolioStatus: null,
        successorMaterial: null,
        demandPlanAdoption: null,
      });

      const saveSpy = jest
        .spyOn(component as any, 'save$')
        .mockReturnValue(of({}));

      component['onSave'](null);

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should close the dialog', () => {
      jest.spyOn(component['dialogRef'], 'close');

      component['onClose']();

      expect(component['dialogRef'].close).toHaveBeenCalledWith(false);
    });
  });

  describe('editButtonVisible', () => {
    it('should return true for SubstitutionProposal type and not past repDate', () => {
      component['data'].type = SpecificModalContentType.SubstitutionProposal;
      component['substitutionProposalEdit'].set(false);
      component['formGroup']
        .get('repDate')
        .setValue(new Date(Date.now() + 10_000));
      expect(component['editButtonVisible']()).toBe(true);
    });

    it('should return false for other types', () => {
      component['data'].type = SpecificModalContentType.PhaseIn;
      expect(component['editButtonVisible']()).toBe(false);
    });
  });

  describe('setFormGroup', () => {
    it('should set required fields and deactivate fields for PhaseIn type', () => {
      component['data'].type = SpecificModalContentType.PhaseIn;
      component['data'].edit = true;
      component['setFormGroup']();

      expect(
        component['formGroup'].get('autoSwitchDate').validator
      ).toBeDefined();
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for Status type', () => {
      component['data'].type = SpecificModalContentType.Status;
      component['setFormGroup']();

      expect(component['formGroup'].get('autoSwitchDate').disabled).toBe(true);
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for NoContent type', () => {
      component['data'].type = SpecificModalContentType.NoContent;
      component['setFormGroup']();

      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for PhaseOut type', () => {
      component['data'].type = SpecificModalContentType.PhaseOut;
      component['setFormGroup']();

      expect(
        component['formGroup'].get('autoSwitchDate').validator
      ).toBeDefined();
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for Substitution type', () => {
      component['data'].type = SpecificModalContentType.Substitution;
      component['setFormGroup']();

      expect(component['formGroup'].get('repDate').validator).toBeDefined();
      expect(
        component['formGroup'].get('successorMaterial').validator
      ).toBeDefined();
      expect(
        component['formGroup'].get('demandPlanAdoption').validator
      ).toBeDefined();
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for SubstitutionProposal type', () => {
      component['data'].type = SpecificModalContentType.SubstitutionProposal;
      component['setFormGroup']();

      expect(component['formGroup'].get('repDate').validator).toBeDefined();
      expect(
        component['formGroup'].get('successorMaterial').validator
      ).toBeDefined();
      expect(
        component['formGroup'].get('materialNumber').validator
      ).toBeDefined();
      expect(component['formGroup'].get('repDate').disabled).toBe(true);
      expect(component['formGroup'].get('successorMaterial').disabled).toBe(
        true
      );
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should set required fields and deactivate fields for Error type', () => {
      component['data'].type = SpecificModalContentType.Error;
      component['setFormGroup']();

      expect(
        component['formGroup'].get('materialNumber').validator
      ).toBeDefined();
      expect(component['formGroup'].get('materialNumber').disabled).toBe(true);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });

    it('should not set any required fields or deactivate fields for unknown type', () => {
      component['data'].type = 'unknown' as SpecificModalContentType;
      component['setFormGroup']();

      expect(component['formGroup'].get('autoSwitchDate').validator).toBeNull();
      expect(component['formGroup'].get('repDate').validator).toBeNull();
      expect(
        component['formGroup'].get('successorMaterial').validator
      ).toBeNull();
      expect(
        component['formGroup'].get('demandPlanAdoption').validator
      ).toBeNull();
      expect(component['formGroup'].get('materialNumber').disabled).toBe(false);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });
  });

  describe('getTranslationKey', () => {
    it('should return the correct translation key for a given DemandPlanAdoption option', () => {
      const option: DemandPlanAdoption = 'DELETE';
      const result = component['getTranslationKey'](option);
      expect(result).toBe(
        'customer.material_portfolio.modal.substitution.transfere_forecast.delete'
      );
    });

    it('should handle lowercase conversion correctly', () => {
      const option: DemandPlanAdoption = 'COPY';
      const result = component['getTranslationKey'](option);
      expect(result).toBe(
        'customer.material_portfolio.modal.substitution.transfere_forecast.copy'
      );
    });

    it('should trim the result', () => {
      const option: DemandPlanAdoption = 'ADD';
      const result = component['getTranslationKey'](option);
      expect(result).toBe(
        'customer.material_portfolio.modal.substitution.transfere_forecast.add'
      );
    });
  });

  describe('onSuccessorChange', () => {
    it('should reset cfcrAction and loading if no successorMaterial', () => {
      component['formGroup'].get('successorMaterial').setValue(null);
      component['onSuccessorChange']();
      expect(component['cfcrAction']()).toBeNull();
      expect(component['loading']()).toBe(false);
    });

    it('should fetch forecast action data if successorMaterial is set', () => {
      jest.spyOn(component['dialogRef'], 'close');

      const getForecastActionDataSpy = jest
        .spyOn(component['cmpService'], 'getForecastActionData')
        .mockReturnValue(
          of({
            cfcrActions: [{ selected: true, cfcrAction: 'TestAction' }] as any,
          })
        );
      component['formGroup'].get('successorMaterial').setValue('TestMaterial');

      component['onSuccessorChange']();

      expect(getForecastActionDataSpy).toHaveBeenCalled();
    });

    it('should reset when service response is invalid', () => {
      // Arrange
      const mockResponse = { cfcrActions: [] } as any;
      jest
        .spyOn(component['cmpService'], 'getForecastActionData')
        .mockReturnValue(of(mockResponse));
      component['formGroup'].get('successorMaterial').setValue('TestMaterial');

      // Act
      component['onSuccessorChange']();

      // Assert
      expect(component['cfcrAction']()).toBeNull();
      expect(component['loading']()).toBe(false);
    });

    it('should handle errors and reset values', () => {
      // Arrange
      component['formGroup'].get('successorMaterial').setValue('TestMaterial');
      jest
        .spyOn(component['cmpService'], 'getForecastActionData')
        .mockReturnValue(EMPTY);

      // Act
      component['onSuccessorChange']();

      // Assert
      expect(component['cfcrAction']()).toBeNull();
      expect(component['loading']()).toBe(true);
    });
  });

  describe('isRadioDisabled', () => {
    it('should return true if cfcrAction is null', () => {
      component['cfcrAction'].set(null);
      expect(component['isRadioDisabled']('TestAction' as any)).toBe(true);
    });

    it('should return true if cfcrAction does not includes the option', () => {
      component['cfcrAction'].set({
        cfcrActions: [{ cfcrAction: 'TestAction' } as any],
      });
      expect(component['isRadioDisabled']('TestAction2' as any)).toBe(true);
    });

    it('should return false if cfcrAction includes the option', () => {
      component['cfcrAction'].set({
        cfcrActions: [{ cfcrAction: 'TestAction' } as any],
      });
      expect(component['isRadioDisabled']('TestAction' as any)).toBe(false);
    });
  });

  describe('getSaveButton', () => {
    it('should return correct translation key for SubstitutionProposal type', () => {
      component['data'].type = SpecificModalContentType.SubstitutionProposal;
      component['substitutionProposalEdit'].set(false);
      expect(component['getSaveButton']()).toBe(
        'customer_material_portfolio.modal.accept'
      );
    });

    it('should return correct translation key for edit mode', () => {
      component['data'].edit = true;
      expect(component['getSaveButton']()).toBe('button.save');
    });
  });

  describe('setConfirmation', () => {
    it('should set description correctly', () => {
      component['setConfirmation']();
      expect(component['data'].description).toBe(
        'customer.material_portfolio.modal.change_to_schaeffler.text'
      );
    });
  });

  describe('deactivateFields', () => {
    it('should disable specified fields', () => {
      component['deactivateFields'](['customerNumber']);
      expect(component['formGroup'].get('customerNumber').disabled).toBe(true);
    });
  });

  describe('addRequired', () => {
    it('should add required validator to specified fields', () => {
      component['addRequired'](['customerNumber']);
      expect(
        component['formGroup'].get('customerNumber').validator
      ).toBeDefined();
    });
  });

  describe('getActionURL', () => {
    it('should return "veto-substitution" for specialType "veto"', () => {
      const result = component['getActionURL']('veto');
      expect(result).toBe('veto-substitution');
    });

    it('should return "accept-substitution" for specialType "accept"', () => {
      const result = component['getActionURL']('accept');
      expect(result).toBe('accept-substitution');
    });

    it('should return "single-substitution" for specialType "change"', () => {
      const result = component['getActionURL']('change');
      expect(result).toBe('single-substitution');
    });

    it('should return "update" for modal type EDIT_MODAL', () => {
      component['data'].modal = CMPChangeModalFlavor.EDIT_MODAL;
      const result = component['getActionURL'](null);
      expect(result).toBe('update');
    });

    it('should return "single-phase-out" for modal type STATUS_TO_PHASE_OUT', () => {
      component['data'].modal = CMPChangeModalFlavor.STATUS_TO_PHASE_OUT;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-phase-out');
    });

    it('should return "single-phase-in" for modal type STATUS_TO_PHASE_IN', () => {
      component['data'].modal = CMPChangeModalFlavor.STATUS_TO_PHASE_IN;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-phase-in');
    });

    it('should return "single-substitution" for modal type STATUS_TO_SUBSTITUTION', () => {
      component['data'].modal = CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-substitution');
    });

    it('should return "single-inactivation" for modal type STATUS_TO_INACTIVE', () => {
      component['data'].modal = CMPChangeModalFlavor.STATUS_TO_INACTIVE;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-inactivation');
    });

    it('should return "single-reactivation" for modal type STATUS_TO_ACTIVE', () => {
      component['data'].modal = CMPChangeModalFlavor.STATUS_TO_ACTIVE;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-reactivation');
    });

    it('should return "single-reactivation" for modal type REVERT_SUBSTITUTION', () => {
      component['data'].modal = CMPChangeModalFlavor.REVERT_SUBSTITUTION;
      const result = component['getActionURL'](null);
      expect(result).toBe('single-reactivation');
    });

    it('should return "change-to-schaeffler" for modal type SCHAEFFLER_SUBSTITUTION', () => {
      component['data'].modal = CMPSpecificModal.SCHAEFFLER_SUBSTITUTION;
      const result = component['getActionURL'](null);
      expect(result).toBe('change-to-schaeffler');
    });

    it('should return null for unknown modal type', () => {
      component['data'].modal = 'unknown' as CMPModal;
      const result = component['getActionURL'](null);
      expect(result).toBeNull();
    });
  });

  describe('save$', () => {
    it('should call saveCMPChange and handle result', (done) => {
      const saveCMPChangeSpy = jest
        .spyOn(component['cmpService'], 'saveCMPChange')
        .mockReturnValue(of({ overallStatus: 'success', response: [] } as any));
      const snackbarSpy = jest.spyOn(
        component['snackbarService'],
        'openSnackBar'
      );
      const getRequestDataMock = jest
        .spyOn(component as any, 'getRequestData')
        .mockReturnValue({ portfolioStatus: 'SE' } as any);
      const getActionURLMock = jest
        .spyOn(component as any, 'getActionURL')
        .mockReturnValue('veto-substitution');

      component['save$'](null).subscribe(() => done());

      expect(getRequestDataMock).toHaveBeenCalledWith();
      expect(getActionURLMock).toHaveBeenCalledWith(null);

      expect(saveCMPChangeSpy).toHaveBeenCalledWith(
        { portfolioStatus: 'SE' } as any,
        false,
        'veto-substitution',
        undefined
      );
      expect(snackbarSpy).toHaveBeenCalled();
    });

    it('should handle warning and open confirmation dialog', (done) => {
      const saveCMPChangeSpy = jest
        .spyOn(component['cmpService'], 'saveCMPChange')
        .mockImplementation(
          (
            _cmpData: CMPData,
            _dryRun: boolean,
            _actionURL: string | null,
            confirmed?: boolean
          ) =>
            of(
              confirmed
                ? ({ overallStatus: 'success', response: [] } as any)
                : ({
                    overallStatus: 'WARNING',
                    overallErrorMsg:
                      'customer.material_portfolio.modal.substitution.warning.add_material',
                    response: [],
                  } as any)
            )
        );
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({ afterClosed: () => of(true) } as any);

      const getRequestDataMock = jest.spyOn(component as any, 'getRequestData');
      const getActionURLMock = jest
        .spyOn(component as any, 'getActionURL')
        .mockReturnValue('veto-substitution');

      component['save$'](null).subscribe(() => done());

      expect(getRequestDataMock).toHaveBeenCalledWith();
      expect(getActionURLMock).toHaveBeenCalledWith(null);

      // first time: confirmed = undefined
      expect(saveCMPChangeSpy).toHaveBeenCalledWith(
        {
          autoSwitchDate: null,
          customerNumber: null,
          demandCharacteristic: null,
          demandPlanAdoption: null,
          materialDescription: null,
          materialNumber: null,
          portfolioStatus: null,
          repDate: null,
          successorMaterial: null,
        },
        false,
        'veto-substitution',
        undefined
      );

      // second time: confirmed = true
      expect(saveCMPChangeSpy).toHaveBeenCalledWith(
        {
          autoSwitchDate: null,
          customerNumber: null,
          demandCharacteristic: null,
          demandPlanAdoption: null,
          materialDescription: null,
          materialNumber: null,
          portfolioStatus: null,
          repDate: null,
          successorMaterial: null,
        },
        false,
        'veto-substitution',
        true
      );

      expect(dialogSpy).toHaveBeenCalled();
    });
  });
});
