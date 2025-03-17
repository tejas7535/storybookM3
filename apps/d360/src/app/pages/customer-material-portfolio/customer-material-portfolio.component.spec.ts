import { MatDialog } from '@angular/material/dialog';

import { of, take, throwError } from 'rxjs';

import { Store } from '@ngrx/store';
import { parseISO } from 'date-fns';
import { MockProvider } from 'ng-mocks';

import {
  CMPData,
  PortfolioStatus,
} from '../../feature/customer-material-portfolio/cmp-modal-types';
import { CMPEntry } from '../../feature/customer-material-portfolio/model';
import {
  CustomerEntry,
  GlobalSelectionStatus,
} from '../../feature/global-selection/model';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { SingleAutocompleteSelectedEvent } from '../../shared/components/inputs/autocomplete/model';
import { Stub } from '../../shared/test/stub.class';
import { CustomerMaterialMultiModalComponent } from './components/modals/customer-material-multi-modal/customer-material-multi-modal.component';
import {
  CustomerMaterialSingleModalComponent,
  SpecificModalContentType,
} from './components/modals/customer-material-single-modal/customer-material-single-modal.component';
import {
  CMPChangeModalFlavor,
  CMPModal,
  CMPSpecificModal,
} from './components/table/status-actions';
import { CustomerMaterialPortfolioComponent } from './customer-material-portfolio.component';

describe('CustomerMaterialPortfolioComponent', () => {
  let component: CustomerMaterialPortfolioComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialPortfolioComponent>({
      component: CustomerMaterialPortfolioComponent,
      providers: [
        MockProvider(MatDialog),
        MockProvider(Store, { select: jest.fn().mockReturnValue(of([])) }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formGroup', () => {
    it('should initialize formGroup with customerControl', () => {
      const formGroup = component['formGroup'];
      expect(formGroup.contains('customerControl')).toBe(true);
    });

    it('should set customerControl value correctly when selectedCustomer is defined', () => {
      const customer = { customerNumber: '123', customerName: 'Test Customer' };
      component['selectedCustomer'].set(customer);
      component['formGroup'].setValue({
        customerControl: {
          id: component['selectedCustomer']().customerNumber,
          text: component['selectedCustomer']().customerName,
        },
      });
      const formGroup = component['formGroup'];
      const customerControlValue = formGroup.get('customerControl')?.value;

      expect(customerControlValue).toEqual({
        id: customer.customerNumber,
        text: customer.customerName,
      });
    });

    it('should validate customerControl as required', () => {
      const formGroup = component['formGroup'];
      const customerControl = formGroup.get('customerControl');

      customerControl?.setValue('');
      expect(customerControl?.valid).toBe(false);
      expect(customerControl?.errors).toEqual({ required: true });

      customerControl?.setValue('Test Value');
      expect(customerControl?.valid).toBe(true);
      expect(customerControl?.errors).toBeNull();
    });
  });

  describe('authorizedToChange', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(null);

      const result = component['authorizedToChange']();

      expect(result).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      const result = component['authorizedToChange']();

      expect(result).toBe(false);
    });
  });

  describe('onUpdateGlobalSelectionState', () => {
    it('should update global selection state and call updateCustomerData', () => {
      const globalSelectionState: GlobalSelectionState = {
        region: [],
        salesArea: [],
        sectorManagement: [],
        salesOrg: [],
        gkamNumber: [],
        customerNumber: [],
        materialClassification: [],
        sector: [],
        materialNumber: [],
        productionPlant: [],
        productionSegment: [],
        alertType: [],
      };
      const updateCustomerDataSpy = jest
        .spyOn(component as any, 'updateCustomerData')
        .mockImplementation(() => {});

      component['onUpdateGlobalSelectionState'](globalSelectionState);

      expect(component['globalSelectionState']()).toEqual(globalSelectionState);
      expect(updateCustomerDataSpy).toHaveBeenCalledWith();
    });

    it('should set the global selection state correctly', () => {
      jest
        .spyOn(component as any, 'updateCustomerData')
        .mockImplementation(() => {});
      const globalSelectionState: GlobalSelectionState = {
        region: [],
        salesArea: [],
        sectorManagement: [],
        salesOrg: [],
        gkamNumber: [],
        customerNumber: [],
        materialClassification: [],
        sector: [],
        materialNumber: [],
        productionPlant: [],
        productionSegment: [],
        alertType: [],
      };

      component['onUpdateGlobalSelectionState'](globalSelectionState);

      expect(component['globalSelectionState']()).toEqual(globalSelectionState);
    });
  });

  describe('openSingleDialog', () => {
    it('should open a dialog with the correct data and refresh on close', () => {
      const modal: CMPModal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;
      const entry: CMPEntry = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'demand1',
        successorMaterial: '789',
        repDate: '2023-01-01',
        pfStatusAutoSwitch: '2023-02-01',
        portfolioStatus: 'PI',
        tlMessageType: '',
        tlMessage: '',
        tlMessageNumber: 0,
        tlMessageId: '',
        tlMessageV1: '',
        tlMessageV2: '',
        tlMessageV3: '',
        tlMessageV4: '',
      };
      const changeToStatus: PortfolioStatus = 'PO';
      const dialogData = {
        data: {
          customerNumber: '123',
          materialNumber: '456',
          materialDescription: 'Test Material',
          demandCharacteristic: 'demand1',
          successorMaterial: '789',
          demandPlanAdoption: null,
          repDate: parseISO('2023-01-01'),
          portfolioStatus: 'PO',
          autoSwitchDate: parseISO('2023-02-01'),
        },
        description: null,
        title: 'Test Title',
        edit: true,
        subtitle: 'Test Subtitle',
      } as any;

      jest.spyOn(component as any, 'getDialogData').mockReturnValue(dialogData);
      jest
        .spyOn(component as any, 'getTypeByStatus')
        .mockReturnValue(SpecificModalContentType.PhaseOut);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['openSingleDialog'](modal, entry, changeToStatus);

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialSingleModalComponent,
        {
          data: {
            type: SpecificModalContentType.PhaseOut,
            modal,
            ...dialogData,
          },
          disableClose: true,
          width: '900px',
          maxWidth: '900px',
          autoFocus: false,
        }
      );
      expect(refreshCounterSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should open a dialog and not refresh on close if refresh is false', () => {
      const modal: CMPModal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;
      const entry: CMPEntry = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'demand1',
        successorMaterial: '789',
        repDate: '2023-01-01',
        pfStatusAutoSwitch: '2023-02-01',
        portfolioStatus: 'PI',
        tlMessageType: '',
        tlMessage: '',
        tlMessageNumber: 0,
        tlMessageId: '',
        tlMessageV1: '',
        tlMessageV2: '',
        tlMessageV3: '',
        tlMessageV4: '',
      };
      const changeToStatus: PortfolioStatus = 'PO';
      const dialogData = {
        data: {
          customerNumber: '123',
          materialNumber: '456',
          materialDescription: 'Test Material',
          demandCharacteristic: 'demand1',
          successorMaterial: '789',
          demandPlanAdoption: null,
          repDate: parseISO('2023-01-01'),
          portfolioStatus: 'PO',
          autoSwitchDate: parseISO('2023-02-01'),
        },
        description: null,
        title: 'Test Title',
        edit: true,
        subtitle: 'Test Subtitle',
      } as any;

      jest.spyOn(component as any, 'getDialogData').mockReturnValue(dialogData);
      jest
        .spyOn(component as any, 'getTypeByStatus')
        .mockReturnValue(SpecificModalContentType.PhaseOut);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(false).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['openSingleDialog'](modal, entry, changeToStatus);

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialSingleModalComponent,
        {
          data: {
            type: SpecificModalContentType.PhaseOut,
            modal,
            ...dialogData,
          },
          disableClose: true,
          width: '900px',
          maxWidth: '900px',
          autoFocus: false,
        }
      );
      expect(refreshCounterSpy).not.toHaveBeenCalled();
    });

    it('should handle null entry correctly', () => {
      const modal: CMPModal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;
      const entry: CMPEntry | null = null;
      const changeToStatus: PortfolioStatus = 'PI';
      const dialogData = {
        data: {
          customerNumber: null,
          materialNumber: null,
          materialDescription: null,
          demandCharacteristic: null,
          successorMaterial: null,
          demandPlanAdoption: null,
          repDate: null,
          portfolioStatus: 'PI',
          autoSwitchDate: null,
        },
        description: null,
        title: 'Test Title',
        edit: false,
        subtitle: 'Test Subtitle',
      } as any;

      jest.spyOn(component as any, 'getDialogData').mockReturnValue(dialogData);
      jest
        .spyOn(component as any, 'getTypeByStatus')
        .mockReturnValue(SpecificModalContentType.PhaseIn);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['openSingleDialog'](modal, entry, changeToStatus);

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialSingleModalComponent,
        {
          data: {
            type: SpecificModalContentType.PhaseIn,
            modal,
            successorSchaefflerMaterial: undefined,
            ...dialogData,
          },
          disableClose: true,
          width: '900px',
          maxWidth: '900px',
          autoFocus: false,
        }
      );
      expect(refreshCounterSpy).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('handleMultiPhaseIn', () => {
    it('should open the CustomerMaterialMultiModalComponent with the correct data', () => {
      const customer = { customerNumber: '123', customerName: 'Test Customer' };
      component['selectedCustomer'].set(customer);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['handleMultiPhaseIn']();

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialMultiModalComponent,
        {
          disableClose: true,
          data: {
            customerNumber: '123',
          },
          panelClass: ['table-dialog', 'customer-material-portfolio'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: '900px',
        }
      );
      expect(refreshCounterSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should open the CustomerMaterialMultiModalComponent with null customerNumber if selectedCustomer is null', () => {
      component['selectedCustomer'].set(null);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['handleMultiPhaseIn']();

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialMultiModalComponent,
        {
          disableClose: true,
          data: {
            customerNumber: null,
          },
          panelClass: ['table-dialog', 'customer-material-portfolio'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: '900px',
        }
      );
      expect(refreshCounterSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should not update refreshCounter if afterClosed returns false', () => {
      const customer = { customerNumber: '123', customerName: 'Test Customer' };
      component['selectedCustomer'].set(customer);
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(false).pipe(take(1)),
        } as any);
      const refreshCounterSpy = jest.spyOn(
        component['refreshCounter'],
        'update'
      );

      component['handleMultiPhaseIn']();

      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerMaterialMultiModalComponent,
        {
          disableClose: true,
          data: {
            customerNumber: '123',
          },
          panelClass: ['table-dialog', 'customer-material-portfolio'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: '900px',
        }
      );
      expect(refreshCounterSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleCustomerChange', () => {
    it('should set selectedCustomer correctly when a matching customer is found', () => {
      const event: SingleAutocompleteSelectedEvent = {
        option: { id: '123' },
      } as any;
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
        { customerNumber: '456', customerName: 'Another Customer' },
      ];
      component['customerData'].set(customerData);

      component['handleCustomerChange'](event);

      expect(component['selectedCustomer']()).toEqual(customerData[0]);
    });

    it('should set selectedCustomer to null when no matching customer is found', () => {
      const event: SingleAutocompleteSelectedEvent = {
        option: { id: '789' },
      } as any;
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
        { customerNumber: '456', customerName: 'Another Customer' },
      ];
      component['customerData'].set(customerData);

      component['handleCustomerChange'](event);

      expect(component['selectedCustomer']()).toBeNull();
    });

    it('should not throw an error when customerData is empty', () => {
      const event: SingleAutocompleteSelectedEvent = {
        option: { id: '123' },
      } as any;
      component['customerData'].set([]);

      expect(() => component['handleCustomerChange'](event)).not.toThrow();
      expect(component['selectedCustomer']()).toBeNull();
    });

    it('should not update formGroup value when selectedCustomer is null', () => {
      const event: SingleAutocompleteSelectedEvent = {
        option: { id: '789' },
      } as any;
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
        { customerNumber: '456', customerName: 'Another Customer' },
      ];
      component['customerData'].set(customerData);

      component['handleCustomerChange'](event);

      expect(component['formGroup'].get('customerControl')?.value).toBe('');
    });
  });

  describe('updateCustomerData', () => {
    it('should set loading to true initially', () => {
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of([]));

      component['updateCustomerData']();

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
    });

    it('should set customerData and selectedCustomer correctly', (done) => {
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
      ];
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of(customerData));
      const setCustomerDataSpy = jest.spyOn(component['customerData'], 'set');
      const setSelectedCustomerSpy = jest.spyOn(
        component['selectedCustomer'],
        'set'
      );
      const setFormGroupSpy = jest.spyOn(component['formGroup'], 'setValue');

      component['updateCustomerData']();

      setTimeout(() => {
        expect(setCustomerDataSpy).toHaveBeenCalledWith(customerData);
        expect(setSelectedCustomerSpy).toHaveBeenCalledWith(customerData[0]);
        expect(setFormGroupSpy).toHaveBeenCalledWith({
          customerControl: {
            id: customerData[0].customerNumber,
            text: customerData[0].customerName,
          },
        });
        done();
      }, 0);
    });

    it('should set globalSelectionStatus correctly', (done) => {
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
      ];
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of(customerData));
      const setGlobalSelectionStatusSpy = jest.spyOn(
        component['globalSelectionStatus'],
        'set'
      );
      jest
        .spyOn(
          component['globalSelectionStateService'],
          'getGlobalSelectionStatus'
        )
        .mockReturnValue({} as GlobalSelectionStatus);

      component['updateCustomerData']();

      setTimeout(() => {
        expect(setGlobalSelectionStatusSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should set loading to false after data is fetched', (done) => {
      const customerData: CustomerEntry[] = [
        { customerNumber: '123', customerName: 'Test Customer' },
      ];
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of(customerData));
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['updateCustomerData']();

      setTimeout(() => {
        expect(setLoadingSpy).toHaveBeenCalledWith(false);
        done();
      }, 0);
    });

    it('should handle errors and set loading to false', (done) => {
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(throwError(() => new Error('Error')));
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      component['updateCustomerData']();

      setTimeout(() => {
        expect(setLoadingSpy).toHaveBeenCalledWith(false);
        done();
      }, 0);
    });
  });

  describe('getTypeByStatus', () => {
    it('should return SubstitutionProposal for SUBSTITUTION_PROPOSAL modal', () => {
      const data: CMPData = { portfolioStatus: 'PI' } as CMPData;
      const modal: CMPModal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.SubstitutionProposal);
    });

    it('should return NoContent for SCHAEFFLER_SUBSTITUTION modal', () => {
      const data: CMPData = { portfolioStatus: 'PI' } as CMPData;
      const modal: CMPModal = CMPSpecificModal.SCHAEFFLER_SUBSTITUTION;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.NoContent);
    });

    it('should return PhaseIn for PI portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'PI' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.PhaseIn);
    });

    it('should return PhaseOut for PO portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'PO' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.PhaseOut);
    });

    it('should return Substitution for SE portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'SE' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.Substitution);
    });

    it('should return Status for IA portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'IA' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.Status);
    });

    it('should return NoContent for SB portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'SB' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.NoContent);
    });

    it('should return NoContent for SI portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'SI' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.NoContent);
    });

    it('should return NoContent for SP portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'SP' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.NoContent);
    });

    it('should return NoContent for AC portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'AC' } as CMPData;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.NoContent);
    });

    it('should return Error for unknown portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'UNKNOWN' } as any;
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTypeByStatus'](data, modal);

      expect(result).toEqual(SpecificModalContentType.Error);
    });
  });

  describe('getDialogData', () => {
    it.each([
      [CMPSpecificModal.SCHAEFFLER_SUBSTITUTION],
      [CMPSpecificModal.SUBSTITUTION_PROPOSAL],
    ])('should return correct data for %s modal', (modal) => {
      const entry: CMPEntry = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'demand1',
        successorMaterial: '789',
        repDate: '2023-01-01',
        pfStatusAutoSwitch: '2023-02-01',
        portfolioStatus: 'PI',
        tlMessageType: '',
        tlMessage: '',
        tlMessageNumber: 0,
        tlMessageId: '',
        tlMessageV1: '',
        tlMessageV2: '',
        tlMessageV3: '',
        tlMessageV4: '',
      };
      const changeToStatus: PortfolioStatus = 'PO';

      const result = component['getDialogData'](modal, entry, changeToStatus);

      expect(result).toEqual({
        data: {
          customerNumber: '123',
          materialNumber: '456',
          materialDescription: 'Test Material',
          demandCharacteristic: 'demand1',
          successorMaterial: '789',
          demandPlanAdoption: null,
          repDate: parseISO('2023-01-01'),
          portfolioStatus: 'PO',
          autoSwitchDate: parseISO('2023-02-01'),
        },
        description: null,
        title: 'customer_material_portfolio.substitution_modal.headline',
        subtitle: 'customer_material_portfolio.modal.subheader.phase_out',
        edit: true,
      });
    });

    it.each([
      [CMPChangeModalFlavor.EDIT_MODAL],
      [CMPChangeModalFlavor.REVERT_SUBSTITUTION],
      [CMPChangeModalFlavor.STATUS_TO_ACTIVE],
      [CMPChangeModalFlavor.STATUS_TO_INACTIVE],
      [CMPChangeModalFlavor.STATUS_TO_PHASE_IN],
      [CMPChangeModalFlavor.STATUS_TO_PHASE_OUT],
      [CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION],
    ])('should return correct data for %s modal', (modal) => {
      const entry: CMPEntry = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'demand1',
        successorMaterial: '789',
        repDate: '2023-01-01',
        pfStatusAutoSwitch: '2023-02-01',
        portfolioStatus: 'PI',
        tlMessageType: '',
        tlMessage: '',
        tlMessageNumber: 0,
        tlMessageId: '',
        tlMessageV1: '',
        tlMessageV2: '',
        tlMessageV3: '',
        tlMessageV4: '',
      };
      const changeToStatus: PortfolioStatus = 'PO';

      const result = component['getDialogData'](modal, entry, changeToStatus);

      expect(result).toEqual({
        data: {
          customerNumber: '123',
          materialNumber: '456',
          materialDescription: 'Test Material',
          demandCharacteristic: 'demand1',
          successorMaterial: '789',
          demandPlanAdoption: null,
          repDate: parseISO('2023-01-01'),
          portfolioStatus: 'PO',
          autoSwitchDate: parseISO('2023-02-01'),
        },
        description: null,
        title: `customer_material_portfolio.modal_headline.${modal}`,
        subtitle: 'customer_material_portfolio.modal.subheader.phase_out',
        edit: true,
      });
    });

    it('should return correct data for new PhaseIn entry', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_PHASE_IN;
      const entry: CMPEntry | null = null;
      const changeToStatus: PortfolioStatus = 'PI';

      const result = component['getDialogData'](modal, entry, changeToStatus);

      expect(result).toEqual({
        data: {
          portfolioStatus: 'PI',
          autoSwitchDate: null,
          repDate: null,
          demandPlanAdoption: null,
          customerNumber: undefined,
          demandCharacteristic: undefined,
          materialDescription: undefined,
          materialNumber: undefined,
          successorMaterial: undefined,
        },
        description: null,
        title: 'customer_material_portfolio.modal_headline.STATUS_TO_PHASE_IN',
        subtitle: 'customer_material_portfolio.modal.subheader.phase_in',
        edit: true,
      });
    });

    it('should handle null entry correctly', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_PHASE_IN;
      const entry: CMPEntry | null = null;
      const changeToStatus: PortfolioStatus = 'PI';

      const result = component['getDialogData'](modal, entry, changeToStatus);

      expect(result).toEqual({
        data: {
          portfolioStatus: 'PI',
          autoSwitchDate: null,
          repDate: null,
          demandPlanAdoption: null,
          customerNumber: undefined,
          demandCharacteristic: undefined,
          materialDescription: undefined,
          materialNumber: undefined,
          successorMaterial: undefined,
        },
        description: null,
        title: 'customer_material_portfolio.modal_headline.STATUS_TO_PHASE_IN',
        subtitle: 'customer_material_portfolio.modal.subheader.phase_in',
        edit: true,
      });
    });

    it.each([
      [CMPSpecificModal.ACCEPT_FORECAST_LOSS],
      [CMPSpecificModal.MULTI_PHASE_IN],
      [CMPSpecificModal.SINGLE_INACTIVATE],
      [CMPSpecificModal.SINGLE_PHASE_IN],
    ])('should return default data for %s modal', (modal) => {
      const entry: CMPEntry = {
        customerNumber: '123',
        materialNumber: '456',
        materialDescription: 'Test Material',
        demandCharacteristic: 'demand1',
        successorMaterial: '789',
        repDate: '2023-01-01',
        pfStatusAutoSwitch: '2023-02-01',
        portfolioStatus: 'PI',
        tlMessageType: '',
        tlMessage: '',
        tlMessageNumber: 0,
        tlMessageId: '',
        tlMessageV1: '',
        tlMessageV2: '',
        tlMessageV3: '',
        tlMessageV4: '',
      };
      const changeToStatus: PortfolioStatus = 'PO';

      const result = component['getDialogData'](modal, entry, changeToStatus);

      expect(result).toEqual({
        data: {
          autoSwitchDate: null,
          customerNumber: null,
          demandCharacteristic: null,
          demandPlanAdoption: null,
          materialDescription: null,
          materialNumber: null,
          portfolioStatus: 'PI',
          repDate: null,
          successorMaterial: null,
        },
        description: null,
        edit: false,
        modal: 'STATUS_TO_PHASE_IN',
        subtitle: 'customer_material_portfolio.modal.subheader.phase_in',
        title: 'customer_material_portfolio.phase_in_modal.headline',
      });
    });
  });

  describe('getSubtitle', () => {
    it('should return the correct subtitle for PI portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'PI' } as CMPData;

      const result = component['getSubtitle'](data);

      expect(result).toEqual(
        'customer_material_portfolio.modal.subheader.phase_in'
      );
    });

    it('should return the correct subtitle for PO portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'PO' } as CMPData;

      const result = component['getSubtitle'](data);

      expect(result).toEqual(
        'customer_material_portfolio.modal.subheader.phase_out'
      );
    });

    it('should return the correct subtitle for SE portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'SE' } as CMPData;

      const result = component['getSubtitle'](data);

      expect(result).toEqual(
        'customer_material_portfolio.modal.subheader.substitution'
      );
    });

    it('should return the correct subtitle for IA portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'IA' } as CMPData;

      const result = component['getSubtitle'](data);

      expect(result).toEqual(
        'customer_material_portfolio.inactive_modal.headline'
      );
    });

    it('should return undefined for unknown portfolio status', () => {
      const data: CMPData = { portfolioStatus: 'UNKNOWN' } as any;

      const result = component['getSubtitle'](data);

      expect(result).toBeUndefined();
    });
  });

  describe('getTitle', () => {
    it('should return the correct title for SCHAEFFLER_SUBSTITUTION modal', () => {
      const modal: CMPModal = CMPSpecificModal.SCHAEFFLER_SUBSTITUTION;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.substitution_modal.headline'
      );
    });

    it('should return the correct title for SUBSTITUTION_PROPOSAL modal', () => {
      const modal: CMPModal = CMPSpecificModal.SUBSTITUTION_PROPOSAL;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.substitution_modal.headline'
      );
    });

    it('should return the correct title for EDIT_MODAL', () => {
      const modal: CMPModal = CMPChangeModalFlavor.EDIT_MODAL;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.EDIT_MODAL'
      );
    });

    it('should return the correct title for REVERT_SUBSTITUTION', () => {
      const modal: CMPModal = CMPChangeModalFlavor.REVERT_SUBSTITUTION;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.REVERT_SUBSTITUTION'
      );
    });

    it('should return the correct title for STATUS_TO_ACTIVE', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_ACTIVE;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.STATUS_TO_ACTIVE'
      );
    });

    it('should return the correct title for STATUS_TO_INACTIVE', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_INACTIVE;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.STATUS_TO_INACTIVE'
      );
    });

    it('should return the correct title for STATUS_TO_PHASE_IN', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_PHASE_IN;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.STATUS_TO_PHASE_IN'
      );
    });

    it('should return the correct title for STATUS_TO_PHASE_OUT', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_PHASE_OUT;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.STATUS_TO_PHASE_OUT'
      );
    });

    it('should return the correct title for STATUS_TO_SUBSTITUTION', () => {
      const modal: CMPModal = CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.STATUS_TO_SUBSTITUTION'
      );
    });

    it('should return the correct title for an unknown modal', () => {
      const modal: CMPModal = 'UNKNOWN_MODAL' as CMPModal;

      const result = component['getTitle'](modal);

      expect(result).toEqual(
        'customer_material_portfolio.modal_headline.UNKNOWN_MODAL'
      );
    });
  });
});
