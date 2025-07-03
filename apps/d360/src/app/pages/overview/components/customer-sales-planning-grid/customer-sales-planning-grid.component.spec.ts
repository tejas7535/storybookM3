import { of, take, throwError } from 'rxjs';

import { CellClickedEvent } from 'ag-grid-enterprise';

import { AppRoutePath } from '../../../../app.routes.enum';
import { RequestType } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import * as ErrorHelper from '../../../../shared/utils/errors';
import { ActionsMenuCellRendererComponent } from './../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { HttpError } from './../../../../shared/utils/http-client';
import { SapErrorMessageHeader } from './../../../../shared/utils/sap-localisation';
import * as Helper from './column-definitions';
import { CustomerSalesPlanningGridComponent } from './customer-sales-planning-grid.component';

describe('CustomerSalesPlanningGridComponent', () => {
  let component: CustomerSalesPlanningGridComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerSalesPlanningGridComponent>({
      component: CustomerSalesPlanningGridComponent,
      providers: [Stub.getOverviewProvider(), Stub.getRouterProvider()],
    });
    Stub.setInputs([
      { property: 'isAssignedToMe', value: false },
      { property: 'customerNumbers', value: ['customer1'] },
      { property: 'gkamNumbers', value: ['gkam1'] },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('params', () => {
    it('should return the correct computed params when inputs are set', () => {
      Stub.setInput('isAssignedToMe', true);
      Stub.setInput('gkamNumbers', ['GKAM1', 'GKAM2']);
      Stub.setInput('customerNumbers', ['C1', 'C2']);

      const result = component['params']();

      expect(result).toEqual({
        isAssignedToMe: true,
        gkamNumbers: ['GKAM1', 'GKAM2'],
        customerNumbers: ['C1', 'C2'],
      });
    });

    it('should return default values when inputs are not set', () => {
      Stub.setInput('isAssignedToMe', false);
      Stub.setInput('gkamNumbers', null);
      Stub.setInput('customerNumbers', null);

      const result = component['params']();

      expect(result).toEqual({
        isAssignedToMe: false,
        gkamNumbers: null,
        customerNumbers: null,
      });
    });
  });

  describe('context', () => {
    it('should return a menu with navigation options for sales planning and demand validation', () => {
      const mockRow = {
        data: {
          customerNumber: '12345',
          customerName: 'Customer A',
        },
      };

      const routerSpy = jest.spyOn(component['router'], 'navigate');
      const navigateSpy = jest.spyOn(
        component['globalSelectionStateService'],
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);

      expect(menu).toEqual([
        {
          text: 'overview.yourCustomer.grid.jumpToFunction',
          submenu: [
            {
              text: 'tabbarMenu.sales-planning.label',
              onClick: expect.any(Function),
            },
            {
              text: 'tabbarMenu.validation-of-demand.label',
              onClick: expect.any(Function),
            },
          ],
        },
      ]);

      // Test submenu actions
      menu[0].submenu[0].onClick();
      expect(sessionStorage.getItem(AppRoutePath.SalesValidationPage)).toEqual(
        JSON.stringify({ customerNumber: '12345' })
      );
      expect(routerSpy).toHaveBeenCalledWith([
        AppRoutePath.SalesValidationPage,
      ]);

      menu[0].submenu[1].onClick();
      expect(navigateSpy).toHaveBeenCalledWith(
        AppRoutePath.DemandValidationPage,
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
        }
      );
    });

    it('should return an empty menu if row data is not provided', () => {
      const menu = component['context'].getMenu({ data: null });

      expect(menu).toEqual([]);
    });
  });

  describe('constructor', () => {
    it('should trigger reload$ when params change', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const paramsSpy = jest.spyOn<any, any>(component, 'params');

      // Mock params to return a value
      paramsSpy.mockReturnValue({ isAssignedToMe: true });

      // Trigger the effect
      Stub.detectChanges();

      expect(paramsSpy).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should not trigger reload$ when params are empty', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const paramsSpy = jest.spyOn<any, any>(component, 'params');

      // Mock params to return null
      paramsSpy.mockReturnValue(null);

      // Trigger the effect
      Stub.detectChanges();

      expect(paramsSpy).toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      component.ngOnInit();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });

  describe('resetSelection', () => {
    it('should deselect all rows and emit null', () => {
      const deselectAllSpy = jest.fn();
      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      // Mock gridApi
      component['gridApi'] = { deselectAll: deselectAllSpy } as any;

      component.resetSelection();

      expect(deselectAllSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('getData$', () => {
    beforeEach(() => (component['gridApi'] = Stub.getGridApi()));

    it('should call overviewService.getRelevantPlanningKPIs with correct parameters and return the response', (done) => {
      Stub.setInputs([
        { property: 'isAssignedToMe', value: true },
        { property: 'customerNumbers', value: ['C1'] },
        { property: 'gkamNumbers', value: ['GKAM1'] },
      ]);

      const mockParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        columnFilters: { columnKey: 'columnValue' },
      } as any;

      const mockResponse = {
        rows: [{ customerNumber: 'C1', customerName: 'Customer A' }],
        rowCount: 1,
      };

      const overviewServiceSpy = jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(of(mockResponse));

      component['getData$'](mockParams, RequestType.Fetch)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(overviewServiceSpy).toHaveBeenCalledWith(
            {
              keyAccountNumber: ['GKAM1'],
              customerNumber: ['C1'],
            },
            true,
            mockParams
          );
          done();
        });
    });

    it('should call resetSelection if the selected customer is not in the new data', (done) => {
      const mockParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        columnFilters: {},
      } as any;

      const mockResponse = {
        rows: [{ customerNumber: 'C2', customerName: 'Customer B' }],
        rowCount: 1,
      };

      const resetSelectionSpy = jest.spyOn<any, any>(
        component,
        'resetSelection'
      );

      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(of(mockResponse));

      // Mock gridApi with a selected customer not in the new data
      jest
        .spyOn(component['gridApi'], 'getSelectedRows')
        .mockReturnValue([{ customerNumber: 'C1' }]);

      component['getData$'](mockParams, RequestType.Fetch)
        .pipe(take(1))
        .subscribe(() => {
          expect(resetSelectionSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should not call resetSelection if the selected customer is in the new data', (done) => {
      const mockParams = {
        startRow: 0,
        endRow: 10,
        sortModel: [],
        columnFilters: {},
      } as any;

      const mockResponse = {
        rows: [{ customerNumber: 'C1', customerName: 'Customer A' }],
        rowCount: 1,
      };

      const resetSelectionSpy = jest.spyOn<any, any>(
        component,
        'resetSelection'
      );

      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(of(mockResponse));

      // Mock gridApi with a selected customer in the new data
      jest
        .spyOn(component['gridApi'], 'getSelectedRows')
        .mockReturnValue([{ customerNumber: 'C1' }]);

      component['getData$'](mockParams, RequestType.Fetch)
        .pipe(take(1))
        .subscribe(() => {
          expect(resetSelectionSpy).not.toHaveBeenCalled();
          done();
        });
    });
  });

  describe('getData$ error handling', () => {
    it('should display a snackbar warning when a problem detail error occurs', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const problemDetailError: HttpError = {
        details: {
          values: {
            [SapErrorMessageHeader.MessageNumber]: 123,
            [SapErrorMessageHeader.MessageId]: '456',
            [SapErrorMessageHeader.MessageV1]: 'Value1',
            [SapErrorMessageHeader.MessageV2]: 'Value2',
            [SapErrorMessageHeader.MessageV3]: 'Value3',
            [SapErrorMessageHeader.MessageV4]: 'Value4',
          },
        },
      } as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(true);

      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');
      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(throwError(() => problemDetailError));

      component['getData$'](mockParams, RequestType.Fetch).subscribe({
        error: () => {
          expect(snackbarSpy).toHaveBeenCalled();
          // Should use the localized message from SAP
          expect(snackbarSpy).not.toHaveBeenCalledWith(
            'Original error message'
          );
          done();
        },
      });
    });

    it('should handle SAP error message formatting correctly', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;

      const sapError: HttpError = {
        details: {
          values: {
            [SapErrorMessageHeader.MessageNumber]: 123,
            [SapErrorMessageHeader.MessageId]: '456',
            [SapErrorMessageHeader.MessageV1]: 'Value1',
            [SapErrorMessageHeader.MessageV2]: 'Value2',
            [SapErrorMessageHeader.MessageV3]: 'Value3',
            [SapErrorMessageHeader.MessageV4]: 'Value4',
          },
        },
      } as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(true);

      // Mock the messageFromSAP function indirectly by expecting the right parameters
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');
      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(throwError(() => sapError));

      component['getData$'](mockParams, RequestType.Fetch).subscribe({
        error: () => {
          expect(snackbarSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle error case with message number 133 correctly', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;

      const error133: HttpError = {
        details: {
          values: {
            [SapErrorMessageHeader.MessageNumber]: '133',
            [SapErrorMessageHeader.MessageId]: 'SAP_MSG_ID',
            [SapErrorMessageHeader.MessageV1]: 'Parameter1',
            [SapErrorMessageHeader.MessageV2]: 'Parameter2',
            [SapErrorMessageHeader.MessageV3]: 'Parameter3',
            [SapErrorMessageHeader.MessageV4]: 'Parameter4',
          },
        },
      } as any;

      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(true);

      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(true);

      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');
      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(throwError(() => error133));

      // Test that the custom error message function in setConfig works with this error
      const configSetSpy = jest.spyOn(component['config'], 'set');
      component['setConfig']([]);
      const customErrorMessageFn =
        configSetSpy.mock.calls[0][0].table.customErrorMessageFn;

      expect(customErrorMessageFn(error133)).toBe('hint.selectData');

      component['getData$'](mockParams, RequestType.Fetch).subscribe({
        error: () => {
          expect(snackbarSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle non-problem detail errors', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const regularError = new Error('Regular error');

      jest
        .spyOn(component['overviewService'], 'getRelevantPlanningKPIs')
        .mockReturnValue(throwError(() => regularError));

      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      component['getData$'](mockParams, RequestType.Fetch).subscribe({
        error: (err) => {
          // Regular errors should not trigger the snackbar
          expect(snackbarSpy).not.toHaveBeenCalled();
          expect(err).toBe(regularError);
          done();
        },
      });
    });
  });

  describe('setConfig', () => {
    it('should configure the table with the correct settings', () => {
      const mockColumnDefs = [
        { field: 'customerNumber', headerName: 'Customer Number' },
        { field: 'customerName', headerName: 'Customer Name' },
      ] as any;

      const configSetSpy = jest.spyOn(component['config'], 'set');
      const toggleSelectionSpy = jest.spyOn<any, any>(
        component,
        'toggleSelection'
      );

      component['setConfig'](mockColumnDefs);

      expect(configSetSpy).toHaveBeenCalledWith({
        callbacks: { onCellClicked: expect.any(Function) },
        customGetFilterCount: null,
        customOnResetFilters: null,
        hasTabView: true,
        hasToolbar: true,
        isLoading$: {
          _value: false,
          closed: false,
          currentObservers: null,
          hasError: false,
          isStopped: false,
          observers: [],
          thrownError: null,
        },
        maxAllowedTabs: 5,
        renderFloatingFilter: true,
        showLoaderForInfiniteScroll: undefined,
        table: {
          autoSizeStrategy: false,
          columnDefs: [
            {
              columnDefs: [
                { field: 'customerNumber', headerName: 'Customer Number' },
                { field: 'customerName', headerName: 'Customer Name' },
              ],
              layoutId: 0,
              title: 'table.defaultTab',
            },
          ],
          context: { getMenu: expect.any(Function) },
          defaultColDef: {
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            suppressHeaderFilterButton: true,
            suppressHeaderMenuButton: true,
          },
          getRowId: expect.any(Function),
          initialColumnDefs: [
            {
              columnDefs: [
                { field: 'customerNumber', headerName: 'Customer Number' },
                { field: 'customerName', headerName: 'Customer Name' },
              ],
              layoutId: 0,
              title: 'table.defaultTab',
            },
          ],
          customErrorMessageFn: expect.any(Function),
          loadingMessage: '',
          noRowsMessage: 'hint.noData',
          serverSideAutoGroup: undefined,
          tableId: 'customer-sales-planning-grid',
        },
        tableClass: 'grow',
      });

      // Test customErrorMessageFn function
      const customErrorMessageFn =
        configSetSpy.mock.calls[0][0].table.customErrorMessageFn;
      expect(
        customErrorMessageFn({
          details: {
            values: { 'x-sap-messagenumber': '133' },
          },
        } as any)
      ).toBe('hint.selectData');
      expect(
        customErrorMessageFn({
          details: {
            values: { 'x-sap-messagenumber': 'abc' },
          },
        } as any)
      ).toBe('');

      // Test getRowId function
      const getRowIdFn = configSetSpy.mock.calls[0][0].table.getRowId;
      const mockRowData = { customerNumber: '12345' } as any;
      expect(getRowIdFn({ data: mockRowData } as any)).toBe('12345');

      // Test onCellClicked callback
      const onCellClickedFn =
        configSetSpy.mock.calls[0][0].callbacks.onCellClicked;
      onCellClickedFn({
        node: { isSelected: jest.fn(), setSelected: jest.fn() },
      } as any);
      expect(toggleSelectionSpy).toHaveBeenCalled();
    });
  });

  describe('setColumnDefinitions', () => {
    it('should configure the table with the correct column definitions for both layouts', () => {
      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');
      const mockColumnDefs = [
        {
          colId: 'col1',
          filter: 'agTextColumnFilter',
          filterParams: {},
        },
        {
          colId: 'col2',
          filter: 'agNumberColumnFilter',
          filterParams: {},
        },
      ];

      jest
        .spyOn<any, any>(Helper, 'getColumnDefs')
        .mockImplementation(() => mockColumnDefs);

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalledWith([
        {
          layoutId: 0,
          title: 'overview.yourCustomer.layout.previousToCurrent',
          columnDefs: [
            ...mockColumnDefs.map((column) => ({
              ...column,
              headerName: `overview.yourCustomer.grid.${column.colId}`,
              headerTooltip: `overview.yourCustomer.grid.${column.colId}`,
              resizable: true,
              suppressHeaderFilterButton: true,
              suppressHeaderMenuButton: true,
            })),
            {
              cellClass: ['fixed-action-column'],
              field: 'menu',
              headerName: '',
              cellRenderer: ActionsMenuCellRendererComponent,
              lockVisible: true,
              lockPinned: true,
              pinned: 'right',
              minWidth: 50,
              maxWidth: 50,
              suppressHeaderMenuButton: true,
              suppressSizeToFit: true,
              suppressColumnsToolPanel: true,
              sortable: false,
            },
          ],
        },
        {
          layoutId: 1,
          title: 'overview.yourCustomer.layout.currentToNext',
          columnDefs: [
            ...mockColumnDefs.map((column) => ({
              ...column,
              headerName: `overview.yourCustomer.grid.${column.colId}`,
              headerTooltip: `overview.yourCustomer.grid.${column.colId}`,
              resizable: true,
              suppressHeaderFilterButton: true,
              suppressHeaderMenuButton: true,
            })),
            {
              cellClass: ['fixed-action-column'],
              field: 'menu',
              headerName: '',
              cellRenderer: ActionsMenuCellRendererComponent,
              lockVisible: true,
              lockPinned: true,
              pinned: 'right',
              minWidth: 50,
              maxWidth: 50,
              suppressHeaderMenuButton: true,
              suppressSizeToFit: true,
              suppressColumnsToolPanel: true,
              sortable: false,
            },
          ],
        },
      ]);
    });
  });

  describe('toggleSelection', () => {
    it('should deselect the row and emit null if the row is already selected', () => {
      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: jest.fn().mockReturnValue(true),
          setSelected: jest.fn(),
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      component['toggleSelection'](mockEvent);

      expect(mockEvent.node.isSelected).toHaveBeenCalled();
      expect(mockEvent.node.setSelected).toHaveBeenCalledWith(false);
      expect(emitSpy).toHaveBeenCalledWith(null);
    });

    it('should select the row and emit its data if the row is not selected', () => {
      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          setSelected: jest.fn(),
          data: { customerNumber: '12345', customerName: 'Customer A' },
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      component['toggleSelection'](mockEvent);

      expect(mockEvent.node.isSelected).toHaveBeenCalled();
      expect(mockEvent.node.setSelected).toHaveBeenCalledWith(true);
      expect(emitSpy).toHaveBeenCalledWith({
        customerNumber: '12345',
        customerName: 'Customer A',
      });
    });

    it('should handle undefined node data gracefully', () => {
      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          setSelected: jest.fn(),
          data: undefined,
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      component['toggleSelection'](mockEvent);

      expect(mockEvent.node.isSelected).toHaveBeenCalled();
      expect(mockEvent.node.setSelected).toHaveBeenCalledWith(true);
      expect(emitSpy).toHaveBeenCalledWith(undefined);
    });

    it('should handle null node data gracefully', () => {
      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          setSelected: jest.fn(),
          data: null,
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      component['toggleSelection'](mockEvent);

      expect(mockEvent.node.isSelected).toHaveBeenCalled();
      expect(mockEvent.node.setSelected).toHaveBeenCalledWith(true);
      expect(emitSpy).toHaveBeenCalledWith(null);
    });

    it('should not cause errors if event node is missing properties', () => {
      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          setSelected: jest.fn(),
          // data property intentionally omitted
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      component['toggleSelection'](mockEvent);

      expect(mockEvent.node.isSelected).toHaveBeenCalled();
      expect(mockEvent.node.setSelected).toHaveBeenCalledWith(true);
      expect(emitSpy).toHaveBeenCalledWith(undefined);
    });

    it('should maintain selected state when toggling multiple times', () => {
      // First toggle - select the row
      const isSelectedMock = jest.fn();
      isSelectedMock.mockReturnValueOnce(false).mockReturnValueOnce(true);

      const setSelectedMock = jest.fn();
      const mockData = { customerNumber: '12345', customerName: 'Customer A' };

      const mockEvent: CellClickedEvent = {
        node: {
          isSelected: isSelectedMock,
          setSelected: setSelectedMock,
          data: mockData,
        },
      } as any;

      const emitSpy = jest.spyOn(component.selectionChanged, 'emit');

      // First call - select the row
      component['toggleSelection'](mockEvent);
      expect(setSelectedMock).toHaveBeenNthCalledWith(1, true);
      expect(emitSpy).toHaveBeenNthCalledWith(1, mockData);

      // Second call - deselect the row
      component['toggleSelection'](mockEvent);
      expect(setSelectedMock).toHaveBeenNthCalledWith(2, false);
      expect(emitSpy).toHaveBeenNthCalledWith(2, null);
    });
  });
});
