import { fakeAsync, tick } from '@angular/core/testing';

import { of, take } from 'rxjs';

import { ColDef, GetRowIdParams } from 'ag-grid-enterprise';

import { RequestType } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import * as Helper from './column-definitions';
import { MaterialListTableComponent } from './material-list-table.component';

describe('MaterialListTableComponent', () => {
  let component: MaterialListTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MaterialListTableComponent>({
      component: MaterialListTableComponent,
      providers: [Stub.getDemandValidationServiceProvider()],
    });

    Stub.setInputs([
      {
        property: 'visible',
        value: true,
      },
      {
        property: 'selectedCustomerNumber',
        value: '12345',
      },
      {
        property: 'demandValidationFilters',
        value: {},
      },
      {
        property: 'confirmContinueAndLooseUnsavedChanges',
        value: () => true,
      },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should trigger reload$ when selectedCustomerNumber and demandValidationFilters are set', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      // Set inputs
      Stub.setInput('selectedCustomerNumber', '12345');
      Stub.setInput('demandValidationFilters', { filterKey: 'filterValue' });

      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should trigger reload$ when selectedCustomerNumber is set and demandValidationFilters is not set', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      // Set only one input
      Stub.setInput('selectedCustomerNumber', '12345');
      Stub.setInput('demandValidationFilters', null);

      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should trigger reload$ when selectedCustomerNumber is not set and demandValidationFilters is set', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      // Set only one input
      Stub.setInput('selectedCustomerNumber', null);
      Stub.setInput('demandValidationFilters', { filterKey: 'filterValue' });

      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalled();
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

  describe('setColumnDefinitions', () => {
    it('should configure the table with the correct column definitions', () => {
      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');
      const mockColumnDefinitions = [
        { colId: 'col1', title: 'Column 1' },
        { colId: 'col2', title: 'Column 2' },
      ];

      jest
        .spyOn<any, any>(Helper, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'col1',
            headerName: 'material_customer.column.col1',
            headerTooltip: 'material_customer.column.col1',
          }),
          expect.objectContaining({
            field: 'col2',
            headerName: 'material_customer.column.col2',
            headerTooltip: 'material_customer.column.col2',
          }),
        ])
      );
    });
  });

  describe('onFirstDataRendered', () => {
    it('should select the first row when data is rendered', fakeAsync(() => {
      const gridApiMock = {
        getRenderedNodes: jest.fn().mockReturnValue([{ data: { id: 1 } }]),
        deselectAll: jest.fn(),
      };
      component['gridApi'] = gridApiMock as any;

      const selectGridRowSpy = jest
        .spyOn<any, any>(component, 'selectGridRow')
        .mockImplementation(() => {});

      component['onFirstDataRendered']();

      tick(150);

      expect(gridApiMock.getRenderedNodes).toHaveBeenCalled();
      expect(gridApiMock.deselectAll).toHaveBeenCalled();
      expect(selectGridRowSpy).toHaveBeenCalledWith({ data: { id: 1 } });
    }));
  });

  describe('onResetFilters', () => {
    it('should emit the default demand validation filters', () => {
      const emitSpy = jest.spyOn(
        component.demandValidationFilterChange,
        'emit'
      );

      component['onResetFilters']();

      expect(emitSpy).toHaveBeenCalledWith({
        productionLine: [],
        productLine: [],
        customerMaterialNumber: [],
        stochasticType: [],
      });
    });
  });

  describe('getFilterCount', () => {
    it('should return 0 if selectedCustomerNumber or demandValidationFilters is not set', () => {
      Stub.setInput('selectedCustomerNumber', null);
      Stub.setInput('demandValidationFilters', null);

      expect(component['getFilterCount']()).toBe(0);
    });

    it('should return the correct count of filters', () => {
      Stub.setInput('selectedCustomerNumber', '12345');
      Stub.setInput('demandValidationFilters', {
        productionLine: [{ value: 'line1' }],
        productLine: [{ value: 'product1' }, { value: 'product2' }],
        customerMaterialNumber: [],
        stochasticType: [{ value: 'type1' }],
      });

      expect(component['getFilterCount']()).toBe(4);
    });
  });

  describe('getData', () => {
    it('should call demandValidationService.getMaterialCustomerData with correct parameters', (done) => {
      Stub.setInput('demandValidationFilters', null);
      Stub.detectChanges();

      const demandValidationServiceSpy = jest
        .spyOn(component['demandValidationService'], 'getMaterialCustomerData')
        .mockReturnValue(
          of({
            rows: [{ id: 1, name: 'Material A' }],
            rowCount: 1,
          })
        );

      const globalSelectionSpy = jest
        .spyOn(component['globalSelectionStateService'], 'getState')
        .mockReturnValue([{ globalFilterKey: 'globalFilterValue' }] as any);

      const params = {
        startRow: 0,
        endRow: 10,
        sortModel: [{ colId: 'name', sort: 'asc' }],
        columnFilters: { columnKey: 'columnValue' },
      } as any;

      component['getData$'](params, RequestType.Fetch)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({
            rows: [{ id: 1, name: 'Material A' }],
            rowCount: 1,
          });

          expect(globalSelectionSpy).toHaveBeenCalled();
          expect(demandValidationServiceSpy).toHaveBeenCalledWith(
            { customerNumber: ['12345'] },
            params
          );

          done();
        });
    });
  });

  describe('setConfig', () => {
    it('should configure the table with the correct settings', () => {
      const mockColumnDefs: ColDef[] = [
        { colId: 'col1', field: 'field1', headerName: 'Header 1' },
        { colId: 'col2', field: 'field2', headerName: 'Header 2' },
      ];

      const configSetSpy = jest.spyOn(component['config'], 'set');
      const onFirstDataRenderedSpy = jest.spyOn<any, any>(
        component,
        'onFirstDataRendered'
      );
      const onCellClickedSpy = jest.spyOn<any, any>(component, 'onCellClicked');
      const onResetFiltersSpy = jest.spyOn<any, any>(
        component,
        'onResetFilters'
      );
      const getFilterCountSpy = jest.spyOn<any, any>(
        component,
        'getFilterCount'
      );

      component['setConfig'](mockColumnDefs);

      expect(configSetSpy).toHaveBeenCalledWith({
        callbacks: {
          onCellClicked: expect.any(Function),
          onFirstDataRendered: expect.any(Function),
        },
        hasTabView: false,
        hasToolbar: true,
        isLoading$: undefined,
        maxAllowedTabs: undefined,
        renderFloatingFilter: false,
        showLoaderForInfiniteScroll: undefined,
        customOnResetFilters: expect.any(Function),
        customGetFilterCount: expect.any(Function),
        table: {
          autoSizeStrategy: { type: 'fitGridWidth' },
          columnDefs: [
            {
              columnDefs: [
                { colId: 'col1', field: 'field1', headerName: 'Header 1' },
                { colId: 'col2', field: 'field2', headerName: 'Header 2' },
              ],
              layoutId: 0,
              title: 'table.defaultTab',
            },
          ],
          context: {},
          defaultColDef: { suppressMovable: true },
          getRowId: expect.any(Function),
          initialColumnDefs: [
            {
              columnDefs: [
                { colId: 'col1', field: 'field1', headerName: 'Header 1' },
                { colId: 'col2', field: 'field2', headerName: 'Header 2' },
              ],
              layoutId: 0,
              title: 'table.defaultTab',
            },
          ],
          loadingMessage: '',
          noRowsMessage: 'hint.noData',
          serverSideAutoGroup: undefined,
          sideBar: {},
          tableId: 'material-list-table',
        },
        tableClass: 'grow',
      });

      // Test getRowId function
      const getRowIdFn = component['config']().table.getRowId;
      const mockRowData = { materialNumber: '12345' };
      expect(getRowIdFn({ data: mockRowData } as GetRowIdParams)).toBe('12345');

      // Test callbacks
      component['config']().callbacks.onFirstDataRendered({} as any);
      expect(onFirstDataRenderedSpy).toHaveBeenCalled();

      component['config']().callbacks.onCellClicked({} as any);
      expect(onCellClickedSpy).toHaveBeenCalled();

      // Test custom functions
      component['config']().customOnResetFilters();
      expect(onResetFiltersSpy).toHaveBeenCalled();

      component['config']().customGetFilterCount();
      expect(getFilterCountSpy).toHaveBeenCalled();
    });
  });

  describe('onCellClicked', () => {
    it('should do nothing when data is not available', () => {
      const selectGridRowSpy = jest.spyOn<any, any>(component, 'selectGridRow');
      const mockEvent = { data: null } as any;

      component['onCellClicked'](mockEvent);

      expect(selectGridRowSpy).not.toHaveBeenCalled();
    });

    it('should not select row when clicking on customerMaterialNumber column with multiple customer material numbers', () => {
      const selectGridRowSpy = jest.spyOn<any, any>(component, 'selectGridRow');
      const mockEvent = {
        data: {
          customerMaterialNumber: 'CUST-123',
          customerMaterialNumberCount: 2,
        },
        column: { getColId: () => 'customerMaterialNumber' },
        node: { data: { materialNumber: 'MAT-123' } },
      } as any;

      component['onCellClicked'](mockEvent);

      expect(selectGridRowSpy).not.toHaveBeenCalled();
    });

    it('should not select row when the same material is already selected', () => {
      const mockMaterial = { materialNumber: 'MAT-123' };
      component['selectedMaterialListEntry'].set(mockMaterial);

      const selectGridRowSpy = jest.spyOn<any, any>(component, 'selectGridRow');
      const mockEvent = {
        data: mockMaterial,
        column: { getColId: () => 'materialNumber' },
        node: { data: mockMaterial },
      } as any;

      component['onCellClicked'](mockEvent);

      expect(selectGridRowSpy).not.toHaveBeenCalled();
    });

    it('should not select row when confirm function returns false', () => {
      Stub.setInput('confirmContinueAndLooseUnsavedChanges', () => false);

      const selectGridRowSpy = jest.spyOn<any, any>(component, 'selectGridRow');
      const mockEvent = {
        data: { materialNumber: 'MAT-123' },
        column: { getColId: () => 'materialNumber' },
        node: { data: { materialNumber: 'MAT-123' } },
      } as any;

      component['onCellClicked'](mockEvent);

      expect(selectGridRowSpy).not.toHaveBeenCalled();
    });

    it('should select row when conditions are met', () => {
      Stub.setInput('confirmContinueAndLooseUnsavedChanges', () => true);
      component['selectedMaterialListEntry'].set({ materialNumber: 'MAT-456' });

      const selectGridRowSpy = jest.spyOn<any, any>(component, 'selectGridRow');
      const mockNode = {
        data: { materialNumber: 'MAT-123' },
        setSelected: jest.fn(),
      };
      const mockEvent = {
        data: { materialNumber: 'MAT-123' },
        column: { getColId: () => 'materialNumber' },
        node: mockNode,
      } as any;

      component['onCellClicked'](mockEvent);

      expect(selectGridRowSpy).toHaveBeenCalledWith(mockNode);
    });
  });

  describe('selectGridRow', () => {
    it('should select the row, update selected material and emit the selection', () => {
      const mockNode = {
        data: { materialNumber: 'MAT-123', name: 'Material 123' },
        setSelected: jest.fn(),
      } as any;

      const selectedMaterialListEntrySpy = jest.spyOn(
        component['selectedMaterialListEntry'],
        'set'
      );
      const emitSpy = jest.spyOn(
        component.selectedMaterialListEntryChange,
        'emit'
      );

      component['selectGridRow'](mockNode);

      expect(mockNode.setSelected).toHaveBeenCalledWith(true, true);
      expect(selectedMaterialListEntrySpy).toHaveBeenCalledWith(mockNode.data);
      expect(emitSpy).toHaveBeenCalledWith(mockNode.data);
    });
  });
});
