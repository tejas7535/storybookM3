import { of } from 'rxjs';

import {
  CellClickedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import { AppRoutePath } from '../../../../app.routes.enum';
import { CustomerSalesPlanningResult } from '../../../../feature/overview/overview.service';
import { Stub } from '../../../../shared/test/stub.class';
import { CustomerSalesPlanningLayout } from '../../overview.component';
import { CustomerSalesPlanningGridComponent } from './customer-sales-planning-grid.component';

describe('CustomerSalesPlanningGridComponent', () => {
  let component: CustomerSalesPlanningGridComponent;
  const testCustomer1 = {
    currency: '',
    customerNumber: '1',
    customerName: 'customer 1',
    lastPlannedBy: 0,
    lastChangeDate: 0,
    firmBusinessPreviousYear: 0,
    yearlyTotalCurrentYear: 0,
    firmBusinessCurrentYear: 0,
    deviationToPreviousYear: 0,
    salesPlannedCurrentYear: 0,
    demandPlannedCurrentYear: 0,
    yearlyTotalNextYear: 0,
    firmBusinessNextYear: 0,
    deviationToCurrentYear: 0,
    salesPlannedNextYear: 0,
    demandPlannedNextYear: 0,
  };
  const testCustomer2 = {
    currency: '',
    customerNumber: '2',
    customerName: 'customer 2',
    lastPlannedBy: 0,
    lastChangeDate: 0,
    firmBusinessPreviousYear: 0,
    yearlyTotalCurrentYear: 0,
    firmBusinessCurrentYear: 0,
    deviationToPreviousYear: 0,
    salesPlannedCurrentYear: 0,
    demandPlannedCurrentYear: 0,
    yearlyTotalNextYear: 0,
    firmBusinessNextYear: 0,
    deviationToCurrentYear: 0,
    salesPlannedNextYear: 0,
    demandPlannedNextYear: 0,
  };

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerSalesPlanningGridComponent,
      providers: [
        Stub.getOverviewProvider(),
        Stub.getCustomerSalesPlanningColumnSettingsServiceProvider(),
      ],
    });
    Stub.setInputs([
      { property: 'isAssignedToMe', value: false },
      {
        property: 'layout',
        value: CustomerSalesPlanningLayout.PreviousToCurrent,
      },
      { property: 'customerNumbers', value: ['customer1'] },
      {
        property: 'gkamNumbers',
        value: ['gkam1'],
      },
    ]);
    const loadedData: CustomerSalesPlanningResult = {
      rowCount: 1,
      rows: [testCustomer1],
    };
    jest
      .spyOn(component['overviewService'], 'getDataFetchedEvent')
      .mockReturnValue(of(loadedData) as any);
    jest
      .spyOn(component['columnSettingsService'], 'loadColumnSettings$')
      .mockReturnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onGridReady', () => {
    let event: GridReadyEvent;

    beforeEach(() => {
      event = {
        api: {
          setGridOption: jest.fn(),
          getSelectedRows: jest.fn(),
        },
      } as unknown as GridReadyEvent;
    });
    it('should set gridApi to event.api', () => {
      component['onGridReady'](event);
      expect(component['gridApi']).toBe(event.api);
    });

    it('should remove selection when currently selected customer is not in the loaded data', () => {
      event = {
        api: {
          setGridOption: jest.fn(),
          getSelectedRows: jest.fn().mockReturnValue([testCustomer2]),
        },
      } as unknown as GridReadyEvent;

      jest
        .spyOn(component['columnSettingsService'], 'loadColumnSettings$')
        .mockReturnValue(of([]));
      const emitSpy = jest.spyOn(component['selectionChanged'], 'emit');
      component['onGridReady'](event);
      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('createColumnDefsForLayout', () => {
    it('should use the default columns when no settings are set', () => {
      const columnDefSpy = jest.spyOn(
        component['columnSettingsService'],
        'getColumnDefs'
      );
      const testLayout = CustomerSalesPlanningLayout.PreviousToCurrent;
      component['createColumnDefsForLayout'](testLayout);
      expect(columnDefSpy).toHaveBeenCalledWith(testLayout);
    });

    it('should build the columns based on the settings from the server when existing', () => {
      const columnDefSpy = jest.spyOn(
        component['columnSettingsService'],
        'loadColumnSettings$'
      );
      const testLayout = CustomerSalesPlanningLayout.PreviousToCurrent;
      component['createColumnDefsForLayout'](testLayout);
      expect(columnDefSpy).not.toHaveBeenCalledWith();
    });
  });

  describe('onDataUpdated', () => {
    it('should show the no data overlay when there is no data in the grid', () => {
      const showNoRowsOverlay = jest.fn();
      (component as any).gridApi = {
        getDisplayedRowCount: jest.fn(() => 0),
        showNoRowsOverlay,
      };
      component['onDataUpdated']();
      expect(showNoRowsOverlay).toHaveBeenCalled();
    });
    it('should hide the no data overlay when there is data in the grid', () => {
      const hideOverlay = jest.fn();
      (component as any).gridApi = {
        getDisplayedRowCount: jest.fn(() => 1),
        hideOverlay,
      };
      component['onDataUpdated']();
      expect(hideOverlay).toHaveBeenCalled();
    });
  });

  describe('menu', () => {
    let submenu: any[];
    beforeEach(() => {
      submenu = component['context'].getMenu({ data: testCustomer1 })[0]
        .submenu;
    });
    it('jump to sales planning on menu item with sales planning label', () => {
      const salesEntry = submenu.find(
        (entry: any) => entry.text === 'tabbarMenu.sales-planning.label'
      );
      const sessionSetSpy = jest.spyOn(sessionStorage, 'setItem');
      const navigateSpy = jest.spyOn(component['router'], 'navigate');

      salesEntry.onClick();
      expect(sessionSetSpy).toHaveBeenCalledWith(
        AppRoutePath.SalesValidationPage,
        JSON.stringify({ customerNumber: '1' })
      );
      expect(navigateSpy).toHaveBeenCalledWith([
        AppRoutePath.SalesValidationPage,
      ]);
    });

    it('jump to sales planning on menu item with demand validation label', () => {
      const vodEntry = submenu.find(
        (entry: any) => entry.text === 'tabbarMenu.validation-of-demand.label'
      );
      const globalNavigateSpy = jest.spyOn(
        component['globalSelectionStateService'],
        'navigateWithGlobalSelection'
      );
      vodEntry.onClick();
      expect(globalNavigateSpy).toHaveBeenCalledWith(
        AppRoutePath.DemandValidationPage,
        { customerNumber: [{ id: '1', text: 'customer 1' }] }
      );
    });
  });

  describe('toggleSelection', () => {
    let event: CellClickedEvent;
    beforeEach(() => {
      event = {
        node: {
          isSelected: jest.fn(),
          setSelected: jest.fn(),
        },
      } as unknown as CellClickedEvent;
    });
    it('should select the entry on click when not selected', () => {
      jest.spyOn(event.node, 'isSelected').mockReturnValue(true);
      const selectSpy = jest.spyOn(event.node, 'setSelected');
      component['toggleSelection'](event);
      expect(selectSpy).toHaveBeenCalledWith(false);
    });

    it('should deselect the entry on click when selected', () => {
      jest.spyOn(event.node, 'isSelected').mockReturnValue(false);
      const selectSpy = jest.spyOn(event.node, 'setSelected');
      component['toggleSelection'](event);
      expect(selectSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onFirstDataRendered', () => {
    let event: FirstDataRenderedEvent;

    beforeEach(() => {
      event = {
        api: {
          setGridOption: jest.fn(),
          getSelectedRows: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;
    });

    it('apply the filter from the settings', () => {
      const applyFilterSpy = jest.spyOn(
        component['columnSettingsService'],
        'applyStoredFilters'
      );
      component['onFirstDataRendered'](event);
      expect(applyFilterSpy).toHaveBeenCalledWith(event.api);
    });
  });

  describe('resetSelection', () => {
    it('should deselect the row', () => {
      const deselectMock = jest.fn();
      (component as any).gridApi = { deselectAll: deselectMock };
      const emitSpy = jest.spyOn(component['selectionChanged'], 'emit');
      component['resetSelection']();
      expect(emitSpy).toHaveBeenCalledWith(null);
      expect(deselectMock).toHaveBeenCalled();
    });
  });
});
