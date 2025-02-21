import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EMPTY, of } from 'rxjs';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  CustomerMaterialSingleModalComponent,
  SpecificModalContentType,
} from './customer-material-single-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';

import {
  CMPChangeModalFlavor,
  CMPSpecificModal,
} from '../../table/status-actions';
import { CMPData } from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { MockComponent } from 'ng-mocks';
import { DatePickerComponent } from 'apps/d360/src/app/shared/components/date-picker/date-picker.component';

describe('CustomerMaterialSingleModalComponent', () => {
  let spectator: Spectator<CustomerMaterialSingleModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialSingleModalComponent,
    imports: [
      ReactiveFormsModule,
      MockComponent(DatePickerComponent),

      // Comment out until https://github.com/help-me-mom/ng-mocks/issues/8634 is fixed
      // MockComponent(SingleAutocompletePreLoadedComponent),
    ],
    mocks: [CMPService, SelectableOptionsService, SnackbarService],
    providers: [
      { provide: MatDialogRef, useValue: { close: jest.fn() } },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
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
        },
      },
    ],
  });

  beforeEach(() => {
    // Remove until https://github.com/help-me-mom/ng-mocks/issues/8634 is fixed
    jest.spyOn(console, 'error').mockImplementation(() => {});
    spectator = createComponent();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('getRequestData', () => {
    it('should construct request data correctly', () => {
      spectator.component['formGroup'].setValue({
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

      const requestData = spectator.component['getRequestData']();

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
      spectator.component['formGroup'].setValue({
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

      const requestData = spectator.component['getRequestData']();

      expect(requestData.materialNumber).toEqual({
        id: '456',
        name: 'Material',
      });
    });
  });

  describe('onSave', () => {
    it('should call save$ method when form is valid', () => {
      spectator.component['data'].type = SpecificModalContentType.NoContent;

      spectator.component['setFormGroup']();

      spectator.component['formGroup'].setValue({
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
        .spyOn(spectator.component as any, 'save$')
        .mockReturnValue(of({}));

      spectator.component['onSave'](null);

      expect(saveSpy).toHaveBeenCalled();
    });

    it('should not call save$ method when form is invalid', () => {
      spectator.component['formGroup'].setValue({
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
        .spyOn(spectator.component as any, 'save$')
        .mockReturnValue(of({}));

      spectator.component['onSave'](null);

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should close the dialog', () => {
      spectator.component['onClose']();
      expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledWith(false);
    });
  });

  describe('editButtonVisible', () => {
    it('should return true for SubstitutionProposal type and not past repDate', () => {
      spectator.component['data'].type =
        SpecificModalContentType.SubstitutionProposal;
      spectator.component['substitutionProposalEdit'].set(false);
      spectator.component['formGroup']
        .get('repDate')
        .setValue(new Date(Date.now() + 10000));
      expect(spectator.component['editButtonVisible']()).toBe(true);
    });

    it('should return false for other types', () => {
      spectator.component['data'].type = SpecificModalContentType.PhaseIn;
      expect(spectator.component['editButtonVisible']()).toBe(false);
    });
  });

  describe('setFormGroup', () => {
    it('should set required fields and deactivate fields based on type', () => {
      spectator.component['data'].type = SpecificModalContentType.PhaseIn;
      spectator.component['setFormGroup']();
      expect(
        spectator.component['formGroup'].get('autoSwitchDate').validator
      ).toBeDefined();
      expect(
        spectator.component['formGroup'].get('customerNumber').disabled
      ).toBe(true);
    });
  });

  describe('onSuccessorChange', () => {
    it('should reset cfcrAction and loading if no successorMaterial', () => {
      spectator.component['formGroup'].get('successorMaterial').setValue(null);
      spectator.component['onSuccessorChange']();
      expect(spectator.component['cfcrAction']()).toBeNull();
      expect(spectator.component['loading']()).toBe(false);
    });

    it('should fetch forecast action data if successorMaterial is set', () => {
      const getForecastActionDataSpy = jest
        .spyOn(spectator.inject(CMPService), 'getForecastActionData')
        .mockReturnValue(
          of({
            cfcrActions: [{ selected: true, cfcrAction: 'TestAction' }] as any,
          })
        );
      spectator.component['formGroup']
        .get('successorMaterial')
        .setValue('TestMaterial');

      spectator.component['onSuccessorChange']();

      expect(getForecastActionDataSpy).toHaveBeenCalled();
    });

    it('should reset when service response is invalid', () => {
      // Arrange
      const mockResponse = { cfcrActions: [] } as any;
      jest
        .spyOn(spectator.inject(CMPService), 'getForecastActionData')
        .mockReturnValue(of(mockResponse));
      spectator.component['formGroup']
        .get('successorMaterial')
        .setValue('TestMaterial');

      // Act
      spectator.component['onSuccessorChange']();

      // Assert
      expect(spectator.component['cfcrAction']()).toBeNull();
      expect(spectator.component['loading']()).toBe(false);
    });

    it('should handle errors and reset values', () => {
      // Arrange
      spectator.component['formGroup']
        .get('successorMaterial')
        .setValue('TestMaterial');
      jest
        .spyOn(spectator.inject(CMPService), 'getForecastActionData')
        .mockReturnValue(EMPTY);

      // Act
      spectator.component['onSuccessorChange']();

      // Assert
      expect(spectator.component['cfcrAction']()).toBeNull();
      expect(spectator.component['loading']()).toBe(true);
    });
  });

  describe('isRadioDisabled', () => {
    it('should return true if cfcrAction is null', () => {
      spectator.component['cfcrAction'].set(null);
      expect(spectator.component['isRadioDisabled']('TestAction' as any)).toBe(
        true
      );
    });

    it('should return true if cfcrAction does not includes the option', () => {
      spectator.component['cfcrAction'].set({
        cfcrActions: [{ cfcrAction: 'TestAction' } as any],
      });
      expect(spectator.component['isRadioDisabled']('TestAction2' as any)).toBe(
        true
      );
    });

    it('should return false if cfcrAction includes the option', () => {
      spectator.component['cfcrAction'].set({
        cfcrActions: [{ cfcrAction: 'TestAction' } as any],
      });
      expect(spectator.component['isRadioDisabled']('TestAction' as any)).toBe(
        false
      );
    });
  });

  describe('getSaveButton', () => {
    it('should return correct translation key for SubstitutionProposal type', () => {
      spectator.component['data'].type =
        SpecificModalContentType.SubstitutionProposal;
      spectator.component['substitutionProposalEdit'].set(false);
      expect(spectator.component['getSaveButton']()).toBe(
        'customer_material_portfolio.modal.accept'
      );
    });

    it('should return correct translation key for edit mode', () => {
      spectator.component['data'].edit = true;
      expect(spectator.component['getSaveButton']()).toBe(
        'customer_material_portfolio.modal.accept'
      );
    });
  });

  describe('setConfirmation', () => {
    it('should set description correctly', () => {
      spectator.component['setConfirmation']();
      expect(spectator.component['data'].description).toBe(
        'customer.material_portfolio.modal.change_to_schaeffler.text'
      );
    });
  });

  describe('deactivateFields', () => {
    it('should disable specified fields', () => {
      spectator.component['deactivateFields'](['customerNumber']);
      expect(
        spectator.component['formGroup'].get('customerNumber').disabled
      ).toBe(true);
    });
  });

  describe('addRequired', () => {
    it('should add required validator to specified fields', () => {
      spectator.component['addRequired'](['customerNumber']);
      expect(
        spectator.component['formGroup'].get('customerNumber').validator
      ).toBeDefined();
    });
  });

  describe('getActionURL', () => {
    it('should return correct URL for specialType veto', () => {
      expect(spectator.component['getActionURL']('veto')).toBe(
        'veto-substitution'
      );
    });

    it('should return correct URL for modal type EDIT_MODAL', () => {
      spectator.component['data'].modal = CMPChangeModalFlavor.EDIT_MODAL;
      expect(spectator.component['getActionURL'](null)).toBe('update');
    });
  });

  describe('save$', () => {
    it('should call saveCMPChange and handle result', (done) => {
      const saveCMPChangeSpy = jest
        .spyOn(spectator.inject(CMPService), 'saveCMPChange')
        .mockReturnValue(of({ overallStatus: 'success', response: [] } as any));
      const snackbarSpy = jest.spyOn(
        spectator.inject(SnackbarService),
        'openSnackBar'
      );
      const getRequestDataMock = jest
        .spyOn(spectator.component as any, 'getRequestData')
        .mockReturnValue({ portfolioStatus: 'SE' } as any);
      const getActionURLMock = jest
        .spyOn(spectator.component as any, 'getActionURL')
        .mockReturnValue('veto-substitution');

      spectator.component['save$'](null).subscribe(() => done());

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
        .spyOn(spectator.inject(CMPService), 'saveCMPChange')
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
        .spyOn(spectator.component['dialog'], 'open')
        .mockReturnValue({ afterClosed: () => of(true) } as any);

      const getRequestDataMock = jest.spyOn(
        spectator.component as any,
        'getRequestData'
      );
      const getActionURLMock = jest
        .spyOn(spectator.component as any, 'getActionURL')
        .mockReturnValue('veto-substitution');

      spectator.component['save$'](null).subscribe(() => done());

      expect(getRequestDataMock).toHaveBeenCalledWith();
      expect(getActionURLMock).toHaveBeenCalledWith(null);

      // first time: confirmed = undefined
      expect(saveCMPChangeSpy).toHaveBeenCalledWith(
        {
          autoSwitchDate: null,
          customerNumber: null,
          demandCharacteristic: 'SE',
          demandPlanAdoption: null,
          materialDescription: 'abc',
          materialNumber: null,
          portfolioStatus: 'SE',
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
          demandCharacteristic: 'SE',
          demandPlanAdoption: null,
          materialDescription: 'abc',
          materialNumber: null,
          portfolioStatus: 'SE',
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
