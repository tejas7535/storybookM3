import { of } from 'rxjs';

import { PlanningView } from '../../../feature/demand-validation/planning-view';
import * as Helper from '../../../feature/demand-validation/time-range';
import { CustomerEntry } from '../../../feature/global-selection/model';
import { Stub } from '../../../shared/test/stub.class';
import { DateRangePeriod } from '../../../shared/utils/date-range';
import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let component: ActionBarComponent;

  beforeEach(() => {
    component = Stub.getForEffect<ActionBarComponent>({
      component: ActionBarComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getStoreProvider(),
        Stub.getDemandValidationServiceProvider(),
        Stub.getUserServiceProvider(),
      ],
    });

    Stub.setInputs([
      { property: 'selectedCustomer', value: {} as CustomerEntry },
      { property: 'customerData', value: [] },
      { property: 'planningView', value: PlanningView.REQUESTED },
      {
        property: 'demandValidationFilters',
        value: {
          customerMaterialNumber: [],
          productLine: [],
          productionLine: [],
          stochasticType: [],
        },
      },
      { property: 'isMaterialListVisible', value: true },
      { property: 'changedKPIs', value: null },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleOnSaveForecast', () => {
    let saveValidatedDemandSingleMccSpy: jest.SpyInstance;
    let snackBarSpy: jest.SpyInstance;
    let logEventSpy: jest.SpyInstance;
    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
      saveValidatedDemandSingleMccSpy = jest
        .spyOn(
          component['demandValidationService'],
          'saveValidatedDemandSingleMcc'
        )
        .mockReturnValue(of(null));

      snackBarSpy = jest.spyOn(component['snackbarService'], 'success');

      logEventSpy = jest.spyOn(component['appInsights'], 'logEvent');

      emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');
    });

    it('should emit true and log event when dryRun is false', () => {
      component['handleOnSaveForecast'](false);

      expect(emitSpy).toHaveBeenCalledWith(true);
      expect(logEventSpy).toHaveBeenCalledWith(
        '[Validated Sales Planning] Upload Single Entries'
      );
    });

    it('should validate entries and add errors for invalid forecasts', () => {
      const mockChangedKPIs = {
        kpiEntries: [
          { validatedForecast: 'invalid', fromDate: new Date() },
          { validatedForecast: -1, fromDate: new Date() },
        ],
      };

      Stub.setInput('changedKPIs', mockChangedKPIs);
      Stub.detectChanges();

      component['handleOnSaveForecast'](true);

      expect(saveValidatedDemandSingleMccSpy).toHaveBeenCalledWith(
        mockChangedKPIs,
        expect.any(Set),
        true
      );
    });

    it('should call saveValidatedDemandSingleMcc and handle success', () => {
      saveValidatedDemandSingleMccSpy.mockReturnValue(of(null));

      component['handleOnSaveForecast'](false);

      expect(saveValidatedDemandSingleMccSpy).toHaveBeenCalled();
      expect(snackBarSpy).toHaveBeenCalledWith(
        'validation_of_demand.save.success'
      );
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should handle errors and not reload the table if errors exist', () => {
      const mockChangedKPIs = {
        kpiEntries: [{ validatedForecast: 'invalid', fromDate: new Date() }],
      };
      Stub.setInput('changedKPIs', mockChangedKPIs);
      Stub.detectChanges();

      component['handleOnSaveForecast'](false);

      expect(emitSpy).not.toHaveBeenCalledWith(null);
    });

    it('should not reload the table for dryRun', () => {
      component['handleOnSaveForecast'](true);

      expect(emitSpy).not.toHaveBeenCalledWith(null);
    });
  });

  describe('handleOnSaveForecast - snackbarService calls', () => {
    let saveValidatedDemandSingleMccSpy: jest.SpyInstance;
    let snackbarErrorSpy: jest.SpyInstance;
    let snackbarSuccessSpy: jest.SpyInstance;

    beforeEach(() => {
      saveValidatedDemandSingleMccSpy = jest
        .spyOn(
          component['demandValidationService'],
          'saveValidatedDemandSingleMcc'
        )
        .mockReturnValue(of(null));

      snackbarErrorSpy = jest.spyOn(component['snackbarService'], 'error');
      snackbarSuccessSpy = jest.spyOn(component['snackbarService'], 'success');
    });

    it('should call snackbarService.error when result is truthy', () => {
      saveValidatedDemandSingleMccSpy.mockReturnValue(of('Error occurred'));

      component['handleOnSaveForecast'](false);

      expect(snackbarErrorSpy).toHaveBeenCalledWith('Error occurred');
      expect(snackbarSuccessSpy).not.toHaveBeenCalled();
    });

    it('should call snackbarService.success when result is falsy', () => {
      saveValidatedDemandSingleMccSpy.mockReturnValue(of(null));

      component['handleOnSaveForecast'](false);

      expect(snackbarSuccessSpy).toHaveBeenCalledWith(
        'validation_of_demand.save.success'
      );
      expect(snackbarErrorSpy).not.toHaveBeenCalled();
    });

    it('should display the correct message for dryRun', () => {
      saveValidatedDemandSingleMccSpy.mockReturnValue(of(null));

      component['handleOnSaveForecast'](true);

      expect(snackbarSuccessSpy).toHaveBeenCalledWith(
        'validation_of_demand.check.success'
      );
      expect(snackbarErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleToggleMaterialListVisible', () => {
    it('should emit toggle event with opposite of current isMaterialListVisible value', () => {
      const emitSpy = jest.spyOn(component.toggleMaterialListVisible, 'emit');

      // Initial value is true
      component['handleToggleMaterialListVisible']();
      expect(emitSpy).toHaveBeenCalledWith({ open: false });

      // Set to false and test again
      Stub.setInput('isMaterialListVisible', false);
      Stub.detectChanges();

      component['handleToggleMaterialListVisible']();
      expect(emitSpy).toHaveBeenCalledWith({ open: true });
    });

    it('should toggle isMaterialListVisible and emit the new state', () => {
      const emitSpy = jest.spyOn(component.toggleMaterialListVisible, 'emit');

      Stub.setInput('isMaterialListVisible', true);
      Stub.detectChanges();

      component['handleToggleMaterialListVisible']();
      expect(emitSpy).toHaveBeenCalledWith({ open: false });

      Stub.setInput('isMaterialListVisible', false);
      Stub.detectChanges();

      component['handleToggleMaterialListVisible']();
      expect(emitSpy).toHaveBeenCalledWith({ open: true });
    });
  });

  describe('handleDemandValidationSettingsChange', () => {
    it('should update planningView model value', () => {
      const setSpy = jest.spyOn(component.planningView, 'set');

      component['handleDemandValidationSettingsChange'](PlanningView.CONFIRMED);

      expect(setSpy).toHaveBeenCalledWith(PlanningView.CONFIRMED);
    });
  });

  describe('handleOnDeleteUnsavedForecast', () => {
    it('should emit null to reload validation table', () => {
      const emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');

      component['handleOnDeleteUnsavedForecast']();

      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('handleCustomerChange', () => {
    it('should emit selected customer when customer changes', () => {
      const emitSpy = jest.spyOn(component.customerChange, 'emit');
      const mockCustomerData = [
        {
          customerNumber: '123',
          customerName: 'Test Customer',
        } as CustomerEntry,
        {
          customerNumber: '456',
          customerName: 'Another Customer',
        } as CustomerEntry,
      ];

      Stub.setInput('customerData', mockCustomerData);
      Stub.detectChanges();

      component['handleCustomerChange']({
        option: { id: '123', text: 'Test Customer' },
      });

      expect(emitSpy).toHaveBeenCalledWith(mockCustomerData[0]);
    });

    it('should emit null if customer not found', () => {
      const emitSpy = jest.spyOn(component.customerChange, 'emit');
      const mockCustomerData = [
        {
          customerNumber: '123',
          customerName: 'Test Customer',
        } as CustomerEntry,
      ];

      Stub.setInput('customerData', mockCustomerData);
      Stub.detectChanges();

      component['handleCustomerChange']({
        option: { id: '999', text: 'Unknown Customer' },
      });

      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('handleDownloadButtonClicked', () => {
    it('should open the export modal with correct data', () => {
      const openDialogSpy = jest.spyOn(component['dialog'], 'open');
      const mockCustomerData = [
        { customerNumber: '123', customerName: 'Test Customer' },
      ];
      const mockFilters: {
        customerMaterialNumber: any[];
        productLine: any[];
        productionLine: any[];
        stochasticType: any[];
      } = {
        customerMaterialNumber: [],
        productLine: [],
        productionLine: [],
        stochasticType: [],
      };

      Stub.setInput('customerData', mockCustomerData);
      Stub.setInput('demandValidationFilters', mockFilters);
      Stub.detectChanges();

      component['dateRange'] = {
        range1: {
          from: new Date(),
          to: new Date(),
          period: DateRangePeriod.Monthly,
        },
      };

      component['handleDownloadButtonClicked']();

      expect(openDialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            customerData: mockCustomerData,
            demandValidationFilters: mockFilters,
            dateRanges: component['dateRange'],
          }),
        })
      );
    });
  });

  describe('handleListModalClicked', () => {
    it('should open the list configuration modal and handle result', () => {
      const openDialogSpy = jest.spyOn(component['dialog'], 'open');
      const mockSelectedCustomer = {
        customerNumber: '123',
        customerName: 'Test Customer',
      };
      const mockDialogRef = { afterClosed: () => of(true) };
      openDialogSpy.mockReturnValue(mockDialogRef as any);

      const reloadSpy = jest.spyOn(
        component as any,
        'reloadTheValidationTable'
      );
      const logEventSpy = jest.spyOn(component['appInsights'], 'logEvent');

      Stub.setInput('selectedCustomer', mockSelectedCustomer);
      Stub.detectChanges();

      component['handleListModalClicked']();

      expect(openDialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: {
            customerName: mockSelectedCustomer.customerName,
            customerNumber: mockSelectedCustomer.customerNumber,
          },
        })
      );

      expect(reloadSpy).toHaveBeenCalledWith(true);
      expect(logEventSpy).toHaveBeenCalledWith(
        '[Validated Sales Planning] Upload List'
      );
    });
  });

  describe('handleGridModalClicked', () => {
    it('should open the grid modal and handle result', () => {
      const openDialogSpy = jest.spyOn(component['dialog'], 'open');
      const mockSelectedCustomer = {
        customerNumber: '123',
        customerName: 'Test Customer',
      };
      const mockDialogRef = { afterClosed: () => of(true) };
      openDialogSpy.mockReturnValue(mockDialogRef as any);

      const reloadSpy = jest.spyOn(
        component as any,
        'reloadTheValidationTable'
      );
      const logEventSpy = jest.spyOn(component['appInsights'], 'logEvent');

      Stub.setInput('selectedCustomer', mockSelectedCustomer);
      Stub.detectChanges();

      component['handleGridModalClicked']();

      expect(openDialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: {
            customerName: mockSelectedCustomer.customerName,
            customerNumber: mockSelectedCustomer.customerNumber,
          },
        })
      );

      expect(reloadSpy).toHaveBeenCalledWith(true);
      expect(logEventSpy).toHaveBeenCalledWith(
        '[Validated Sales Planning] Upload Grid'
      );
    });
  });

  describe('handleDeleteModalClicked', () => {
    it('should open the delete modal with correct data', () => {
      const openDialogSpy = jest.spyOn(component['dialog'], 'open');
      const mockSelectedCustomer = {
        customerNumber: '123',
        customerName: 'Test Customer',
      };

      Stub.setInput('selectedCustomer', mockSelectedCustomer);
      Stub.detectChanges();

      component['handleDeleteModalClicked']();

      expect(openDialogSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: expect.objectContaining({
            customerName: mockSelectedCustomer.customerName,
            customerNumber: mockSelectedCustomer.customerNumber,
            onSave: expect.any(Function),
          }),
        })
      );
    });
  });

  describe('onDateSelectionChange', () => {
    it('should update dateRange and emit dateRangeChanged event', () => {
      const emitSpy = jest.spyOn(component.dateRangeChanged, 'emit');
      const updateSettingsSpy = jest.spyOn(
        component['userService'],
        'updateDemandValidationUserSettings'
      );

      const mockDateRange = {
        range1: {
          from: new Date(),
          to: new Date(),
          period: DateRangePeriod.Monthly,
        },
      };

      component['onDateSelectionChange'](mockDateRange);

      expect(component['dateRange']).toBe(mockDateRange);
      expect(emitSpy).toHaveBeenCalledWith(mockDateRange);
      expect(updateSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('reloadTheValidationTable', () => {
    it('should emit null to reload validation table when reload is true', () => {
      const emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');

      component['reloadTheValidationTable'](true);

      expect(emitSpy).toHaveBeenCalledWith(null);
    });

    it('should not emit when reload is false', () => {
      const emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');

      component['reloadTheValidationTable'](false);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('onSaveInModal', () => {
    it('should return a function that emits reload and logs event', () => {
      const emitSpy = jest.spyOn(component.reloadValidationTable, 'emit');
      const logEventSpy = jest.spyOn(component['appInsights'], 'logEvent');

      const callback = component['onSaveInModal']('Test Event');
      callback();

      expect(emitSpy).toHaveBeenCalledWith(null);
      expect(logEventSpy).toHaveBeenCalledWith('Test Event');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize customerSelectableValues from customerData', () => {
      const mockCustomerData = [
        {
          customerNumber: '123',
          customerName: 'Test Customer',
        },
        {
          customerNumber: '456',
          customerName: 'Another Customer',
        },
      ] as CustomerEntry[];

      Stub.setInput('customerData', mockCustomerData);

      component.ngOnInit();

      expect(component['customerSelectableValues']()).toEqual({
        options: [
          { id: '123', text: 'Test Customer' },
          { id: '456', text: 'Another Customer' },
        ],
      });
    });

    it('should initialize customerControl with selectedCustomer value if available', () => {
      const mockSelectedCustomer = {
        customerNumber: '123',
        customerName: 'Test Customer',
      } as CustomerEntry;

      Stub.setInput('selectedCustomer', mockSelectedCustomer);

      component.ngOnInit();

      expect(component['formGroup'].controls.customerControl.value).toEqual({
        id: '123',
        text: 'Test Customer',
      });
    });

    it('should set dateRange from userSettings and emit dateRangeChanged', () => {
      const mockDateRange = {
        range1: {
          from: new Date(),
          to: new Date(),
          period: DateRangePeriod.Monthly,
        },
      };

      const settingsLoadedSubject = component['userService'].settingsLoaded$;
      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        demandValidation: {
          timeRange: {} as any,
        } as any,
      } as any);

      const emitSpy = jest.spyOn(component.dateRangeChanged, 'emit');

      // Mock convertToKpiDateRanges function
      jest
        .spyOn(Helper, 'convertToKpiDateRanges')
        .mockReturnValue(mockDateRange);

      component.ngOnInit();

      // Simulate settings loaded
      (settingsLoadedSubject as any).next(true);

      expect(component['dateRange']).toEqual(mockDateRange);
      expect(emitSpy).toHaveBeenCalledWith(mockDateRange);
    });

    it('should initialize customerSelectableValues and customerControl', () => {
      const mockCustomerData = [
        { customerNumber: '123', customerName: 'Test Customer' },
        { customerNumber: '456', customerName: 'Another Customer' },
      ];

      Stub.setInput('customerData', mockCustomerData);
      Stub.setInput('selectedCustomer', mockCustomerData[0]);
      Stub.detectChanges();

      component.ngOnInit();

      expect(component['customerSelectableValues']()).toEqual({
        options: [
          { id: '123', text: 'Test Customer' },
          { id: '456', text: 'Another Customer' },
        ],
      });

      expect(component['formGroup'].controls.customerControl.value).toEqual({
        id: '123',
        text: 'Test Customer',
      });
    });
  });

  describe('authorizedToChange', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(null);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return false if backendRoles does not include any allowed roles', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(['user']);

      expect(component['authorizedToChange']()).toBe(false);
    });

    it('should return true if backendRoles includes at least one allowed role', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['SD-D360_ADMIN']);

      expect(component['authorizedToChange']()).toBe(true);
    });

    it('should return true if backendRoles includes multiple allowed roles', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['D360_DM_DPLANNER', 'SD-D360_ADMIN']);

      expect(component['authorizedToChange']()).toBe(true);
    });

    it('should return false if backendRoles includes roles but none are allowed', () => {
      jest
        .spyOn(component as any, 'backendRoles')
        .mockReturnValue(['guest', 'viewer']);

      expect(component['authorizedToChange']()).toBe(false);
    });
  });

  describe('disableUpload', () => {
    it('should return false for disableUpload if planningView is not CONFIRMED', () => {
      Stub.setInput('planningView', PlanningView.REQUESTED);
      Stub.detectChanges();

      expect(component['disableUpload']()).toBe(false);
    });
  });

  describe('cleanKPIs', () => {
    it('should return true when changedKPIs is not null', () => {
      Stub.setInput('changedKPIs', { kpiEntries: [] });
      Stub.detectChanges();

      expect(component['cleanKPIs']()).toBe(true);
    });

    it('should return false when changedKPIs is null', () => {
      Stub.setInput('changedKPIs', null);
      Stub.detectChanges();

      expect(component['cleanKPIs']()).toBe(false);
    });
  });

  describe('leftSide and rightSide buttons', () => {
    it('should disable buttons based on cleanKPIs, authorizedToChange, and disableUpload', () => {
      Stub.setInput('changedKPIs', { kpiEntries: [] });
      Stub.setInput('planningView', PlanningView.CONFIRMED);
      Stub.detectChanges();

      const leftSideButtons = component['leftSide']();
      const rightSideButtons = component['rightSide']();

      const menuButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.editAsList'
      );
      const gridButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.editAsGrid'
      );
      const deleteButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.bashDelete'
      );

      expect(menuButton?.disabled).toBe(true);
      expect(gridButton?.disabled).toBe(true);
      expect(deleteButton?.disabled).toBe(true);

      const checkButton = rightSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.checkInput'
      );
      const saveButton = rightSideButtons.find(
        (btn) => btn.text === 'button.save'
      );

      expect(checkButton?.disabled).toBe(false);
      expect(saveButton?.disabled).toBe(false);
    });

    it('should disable appropriate buttons when cleanKPIs is true', () => {
      Stub.setInput('changedKPIs', { kpiEntries: [] });
      Stub.detectChanges();

      const leftSideButtons = component['leftSide']();
      const rightSideButtons = component['rightSide']();

      // Check that menu, grid, and delete buttons are disabled when cleanKPIs is true
      const menuButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.editAsList'
      );
      const gridButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.editAsGrid'
      );
      const deleteButton = leftSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.bashDelete'
      );

      expect(menuButton?.disabled).toBe(true);
      expect(gridButton?.disabled).toBe(true);
      expect(deleteButton?.disabled).toBe(true);

      // Check that save buttons are enabled when cleanKPIs is true
      const checkButton = rightSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.checkInput'
      );
      const saveButton = rightSideButtons.find(
        (btn) => btn.text === 'button.save'
      );

      expect(checkButton?.disabled).toBe(false);
      expect(saveButton?.disabled).toBe(false);
    });

    it('should enable appropriate buttons when cleanKPIs is false', () => {
      Stub.setInput('changedKPIs', null);
      Stub.detectChanges();

      const rightSideButtons = component['rightSide']();

      // Check that delete unsaved forecast, check, and save buttons are disabled when cleanKPIs is false
      const deleteUnsavedButton = rightSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.deleteInput'
      );
      const checkButton = rightSideButtons.find(
        (btn) => btn.tooltip === 'validation_of_demand.actionBar.checkInput'
      );
      const saveButton = rightSideButtons.find(
        (btn) => btn.text === 'button.save'
      );

      expect(deleteUnsavedButton?.disabled).toBe(true);
      expect(checkButton?.disabled).toBe(true);
      expect(saveButton?.disabled).toBe(true);
    });

    it('should reflect isMaterialListVisible in toggle button class', () => {
      Stub.setInput('isMaterialListVisible', true);
      Stub.detectChanges();

      const toggleButton = component['leftSide']()[0];
      expect(toggleButton.class).toBe('icon-button-primary');

      Stub.setInput('isMaterialListVisible', false);
      Stub.detectChanges();

      const updatedToggleButton = component['leftSide']()[0];
      expect(updatedToggleButton.class).toBe('');
    });
  });
});
