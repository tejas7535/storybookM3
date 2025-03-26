import { EMPTY, of, throwError } from 'rxjs';

import { MaterialListEntry } from '../../feature/demand-validation/model';
import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { Stub } from '../../shared/test/stub.class';
import { DemandValidationComponent } from './demand-validation.component';

describe('DemandValidationComponent', () => {
  let component: DemandValidationComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationComponent>({
      component: DemandValidationComponent,
    });

    jest.spyOn(global, 'confirm').mockReturnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set globalSelection from globalSelectionStateService', () => {
      const mockGlobalSelectionState = { region: [] } as GlobalSelectionState;
      jest
        .spyOn(component['globalSelectionStateService'], 'getState')
        .mockReturnValue(mockGlobalSelectionState);

      component.ngOnInit();

      expect(component['globalSelection']).toBe(mockGlobalSelectionState);
    });

    it('should call updateCustomerData', () => {
      const updateCustomerDataSpy = jest.spyOn(
        component as any,
        'updateCustomerData'
      );

      component.ngOnInit();

      expect(updateCustomerDataSpy).toHaveBeenCalled();
    });
  });

  describe('canDeactivate', () => {
    it('should return true if there are no unsaved changes', () => {
      component['unsavedChanges'].set(false);

      const result = component.canDeactivate();

      expect(result).toBe(true);
    });

    it('should return confirm dialog result if there are unsaved changes', () => {
      component['unsavedChanges'].set(true);
      const confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(true);

      const result = component.canDeactivate();

      expect(confirmSpy).toHaveBeenCalledWith('error.unsaved_changes');
      expect(result).toBe(true);
    });

    it('should return false if confirm dialog is cancelled', () => {
      component['unsavedChanges'].set(true);
      const confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(false);

      const result = component.canDeactivate();

      expect(confirmSpy).toHaveBeenCalledWith('error.unsaved_changes');
      expect(result).toBe(false);
    });
  });

  describe('onUpdateGlobalSelection', () => {
    it('should update globalSelection with the event data', () => {
      const mockEvent = { region: [] } as GlobalSelectionState;

      component['onUpdateGlobalSelection'](mockEvent);

      expect(component['globalSelection']).toBe(mockEvent);
    });

    it('should set selectedMaterialListEntry to null', () => {
      component['selectedMaterialListEntry'].set({} as MaterialListEntry);

      component['onUpdateGlobalSelection']({} as GlobalSelectionState);

      expect(component['selectedMaterialListEntry']()).toBeNull();
    });

    it('should call updateCustomerData', () => {
      const updateCustomerDataSpy = jest.spyOn(
        component as any,
        'updateCustomerData'
      );

      component['onUpdateGlobalSelection']({} as GlobalSelectionState);

      expect(updateCustomerDataSpy).toHaveBeenCalled();
    });
  });

  describe('updateCustomerData', () => {
    it('should set globalSelectionStatus to null, selectedCustomer to undefined, and loading to true initially', () => {
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(EMPTY);
      component['updateCustomerData']();

      expect(component['globalSelectionStatus']()).toBeNull();
      expect(component['selectedCustomer']()).toBeUndefined();
      expect(component['loading']()).toBe(true);
    });

    it('should set customerData and selectedCustomer on successful data fetch', (done) => {
      const mockData = [{ id: 1, name: 'Customer 1' } as any] as any[];
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of(mockData));

      component['updateCustomerData']();

      setTimeout(() => {
        expect(component['customerData']()).toEqual(mockData);
        expect(component['selectedCustomer']()).toEqual(mockData[0]);
        done();
      }, 0);
    });

    it('should set globalSelectionStatus and loading to false on successful data fetch', (done) => {
      const mockData = [{ id: 1, name: 'Customer 1' }] as any[];
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(of(mockData));
      jest
        .spyOn(
          component['globalSelectionStateService'],
          'getGlobalSelectionStatus'
        )
        .mockReturnValue({ status: 'valid' } as any);

      component['updateCustomerData']();

      setTimeout(() => {
        expect(component['globalSelectionStatus']()).toEqual({
          status: 'valid',
        });
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });

    it('should set loading to false on error', (done) => {
      jest
        .spyOn(component['globalSelectionService'], 'getCustomersData')
        .mockReturnValue(throwError(() => new Error('Error fetching data')));

      component['updateCustomerData']();

      setTimeout(() => {
        expect(component['loading']()).toBe(false);
        done();
      }, 0);
    });
  });

  describe('reloadValidationTable', () => {
    it('should increment reloadRequired if showLoaderOnly is null', () => {
      const initialReloadRequired = component['reloadRequired']();
      component['reloadValidationTable'](null);
      expect(component['reloadRequired']()).toBe(initialReloadRequired + 1);
    });

    it('should set showLoader to true if showLoaderOnly is true', () => {
      component['reloadValidationTable'](true);
      expect(component['showLoader']()).toBe(true);
    });

    it('should set showLoader to false if showLoaderOnly is false', () => {
      component['reloadValidationTable'](false);
      expect(component['showLoader']()).toBe(false);
    });
  });

  describe('confirmContinueAndLooseUnsavedChanges', () => {
    it('should remove beforeUnloadHandler from window before adding it', () => {
      const removeEventListenerSpy = jest.spyOn(global, 'removeEventListener');
      component['confirmContinueAndLooseUnsavedChanges']();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
    });

    it('should add beforeUnloadHandler to window if there are unsaved changes', () => {
      component['unsavedChanges'].set(true);
      const addEventListenerSpy = jest.spyOn(global, 'addEventListener');
      component['confirmContinueAndLooseUnsavedChanges']();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
    });

    it('should not add beforeUnloadHandler to window if there are no unsaved changes', () => {
      component['unsavedChanges'].set(false);
      const addEventListenerSpy = jest.spyOn(global, 'addEventListener');
      component['confirmContinueAndLooseUnsavedChanges']();
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should return true if there are no unsaved changes', () => {
      component['unsavedChanges'].set(false);
      const result = component['confirmContinueAndLooseUnsavedChanges']();
      expect(result).toBe(true);
    });

    it('should return confirm dialog result if there are unsaved changes', () => {
      component['unsavedChanges'].set(true);
      const confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(true);
      const result = component['confirmContinueAndLooseUnsavedChanges']();
      expect(confirmSpy).toHaveBeenCalledWith('error.unsaved_changes');
      expect(result).toBe(true);
    });

    it('should return false if confirm dialog is cancelled', () => {
      component['unsavedChanges'].set(true);
      const confirmSpy = jest.spyOn(global, 'confirm').mockReturnValue(false);
      const result = component['confirmContinueAndLooseUnsavedChanges']();
      expect(confirmSpy).toHaveBeenCalledWith('error.unsaved_changes');
      expect(result).toBe(false);
    });
  });

  describe('handleMaterialListVisible', () => {
    it('should set materialListVisible to true when open is true', () => {
      component['handleMaterialListVisible']({ open: true });
      expect(component['materialListVisible']()).toBe(true);
    });

    it('should set materialListVisible to false when open is false', () => {
      component['handleMaterialListVisible']({ open: false });
      expect(component['materialListVisible']()).toBe(false);
    });
  });

  describe('handleMaterialListEntrySelected', () => {
    it('should set selectedMaterialListEntry to the provided event', () => {
      const mockEvent = { id: 1, name: 'Material 1' } as MaterialListEntry;

      component['handleMaterialListEntrySelected'](mockEvent);

      expect(component['selectedMaterialListEntry']()).toBe(mockEvent);
    });

    it('should not set selectedMaterialListEntry if event is null', () => {
      component['selectedMaterialListEntry'].set({
        id: 1,
        name: 'Material 1',
      } as MaterialListEntry);

      component['handleMaterialListEntrySelected'](null);

      expect(component['selectedMaterialListEntry']()).toBeNull();
    });

    it('should not set selectedMaterialListEntry if event is undefined', () => {
      component['selectedMaterialListEntry'].set({
        id: 1,
        name: 'Material 1',
      } as MaterialListEntry);

      component['handleMaterialListEntrySelected'](undefined as any);

      expect(component['selectedMaterialListEntry']()).toBeUndefined();
    });
  });

  describe('handleKpiDateRangeChange', () => {
    it('should set dateRange to the provided event', () => {
      const mockEvent = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      } as any;

      component['handleKpiDateRangeChange'](mockEvent);

      expect(component['dateRange']()).toBe(mockEvent);
    });

    it('should not set dateRange if event is null', () => {
      component['dateRange'].set({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      } as any);

      component['handleKpiDateRangeChange'](null);

      expect(component['dateRange']()).toBeNull();
    });

    it('should not set dateRange if event is undefined', () => {
      component['dateRange'].set({
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      } as any);

      component['handleKpiDateRangeChange'](undefined as any);

      expect(component['dateRange']()).toBeUndefined();
    });
  });

  describe('handleCustomerChange', () => {
    it('should set selectedCustomer to the provided event', () => {
      const mockEvent = { id: 1, name: 'Customer 1' } as any;

      component['handleCustomerChange'](mockEvent);

      expect(component['selectedCustomer']()).toBe(mockEvent);
    });

    it('should set selectedMaterialListEntry to null', () => {
      component['selectedMaterialListEntry'].set({
        id: 1,
        name: 'Material 1',
      } as MaterialListEntry);

      component['handleCustomerChange']({
        id: 1,
        name: 'Customer 1',
      } as any);

      expect(component['selectedMaterialListEntry']()).toBeNull();
    });

    it('should not set selectedCustomer if event is null', () => {
      component['selectedCustomer'].set({
        id: 1,
        name: 'Customer 1',
      } as any);

      component['handleCustomerChange'](null);

      expect(component['selectedCustomer']()).toBeNull();
    });

    it('should not set selectedCustomer if event is undefined', () => {
      component['selectedCustomer'].set({
        id: 1,
        name: 'Customer 1',
      } as any);

      component['handleCustomerChange'](undefined as any);

      expect(component['selectedCustomer']()).toBeUndefined();
    });
  });

  describe('demandValidationFilterChange', () => {
    it('should set demandValidationFilters to the provided event', () => {
      const mockEvent = { filter: 'test' } as any;

      component['demandValidationFilterChange'](mockEvent);

      expect(component['demandValidationFilters']()).toBe(mockEvent);
    });

    it('should set selectedMaterialListEntry to null', () => {
      component['selectedMaterialListEntry'].set({
        id: 1,
        name: 'Material 1',
      } as MaterialListEntry);

      component['demandValidationFilterChange']({
        filter: 'test',
      } as any);

      expect(component['selectedMaterialListEntry']()).toBeNull();
    });

    it('should not set demandValidationFilters if event is null', () => {
      component['demandValidationFilters'].set({
        filter: 'test',
      } as any);

      component['demandValidationFilterChange'](null);

      expect(component['demandValidationFilters']()).toBeNull();
    });

    it('should not set demandValidationFilters if event is undefined', () => {
      component['demandValidationFilters'].set({
        filter: 'test',
      } as any);

      component['demandValidationFilterChange'](undefined as any);

      expect(component['demandValidationFilters']()).toBeUndefined();
    });
  });

  describe('onValuesChanged', () => {
    it('should set changedKPIs to the provided data', () => {
      const mockData = { kpi: 'value' } as any;

      component['onValuesChanged'](mockData);

      expect(component['changedKPIs']()).toBe(mockData);
    });

    it('should set unsavedChanges to true if data is not null', () => {
      const mockData = { kpi: 'value' } as any;

      component['onValuesChanged'](mockData);

      expect(component['unsavedChanges']()).toBe(true);
    });

    it('should set unsavedChanges to false if data is null', () => {
      component['onValuesChanged'](null);

      expect(component['unsavedChanges']()).toBe(false);
    });

    it('should set changedKPIs to null if data is null', () => {
      component['onValuesChanged'](null);

      expect(component['changedKPIs']()).toBeNull();
    });
  });
});
