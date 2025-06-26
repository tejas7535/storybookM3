import { of, take, throwError } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { SalesPlanningDetailLevel } from '../../../../feature/sales-planning/model';
import { AgGridFilterType } from '../../../../shared/ag-grid/grid-types';
import { Stub } from '../../../../shared/test/stub.class';
import { SalesPlanningGroupLevelCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-group-level-cell-renderer/sales-planning-group-level-cell-renderer.component';
import * as Helper from './column-definition';
import { CustomerPlanningDetailsComponent } from './customer-planning-details.component';

describe('CustomerPlanningDetailsComponent', () => {
  let component: CustomerPlanningDetailsComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerPlanningDetailsComponent>({
      component: CustomerPlanningDetailsComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getPlanningLevelServiceProvider(),
        Stub.getPlanningLevelServiceProvider(),
        Stub.getSalesPlanningServiceProvider({
          getDetailedCustomerSalesPlan: [
            { planningYear: '2023', planningMaterial: 'Material1' },
          ],
        }),
        Stub.getNumberWithoutFractionDigitsPipeProvider(),
        Stub.getTranslocoLocaleServiceProvider(),
      ],
    });

    Stub.setInputs([
      {
        property: 'customer',
        value: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
          planningCurrency: 'USD',
        },
      },
      { property: 'tableInFullscreen', value: false },
      { property: 'toggleFullscreen', value: () => {} },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should reset planningLevelMaterialConfiguration and call loadData if a customer is selected', () => {
      const loadDataSpy = jest.spyOn<any, any>(component, 'loadData');
      const setSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );

      // Mock customer input
      Stub.setInput('customer', {
        customerName: 'Customer A',
        customerNumber: '12345',
      });

      Stub.detectChanges();

      expect(setSpy).toHaveBeenCalledWith(null);
      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should reset planningLevelMaterialConfiguration and trigger reload$ if no customer is selected', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const setSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );

      // Mock customer input
      Stub.setInput('customer', {
        customerName: '',
        customerNumber: '',
      });

      Stub.detectChanges();

      expect(setSpy).toHaveBeenCalledWith(null);
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('getData', () => {
    it('should fetch data when a customer is selected', (done) => {
      const salesPlanningServiceSpy = jest.spyOn(
        component['salesPlanningService'],
        'getDetailedCustomerSalesPlan'
      );

      component['getData$']().subscribe((response) => {
        expect(response.content).toEqual([
          { planningYear: '2023', planningMaterial: 'Material1' },
        ]);
        expect(salesPlanningServiceSpy).toHaveBeenCalledWith({
          customerNumber: '0000086023',
          planningCurrency: 'USD',
          planningLevelMaterialType: 'GP',
          detailLevel:
            SalesPlanningDetailLevel.YearlyAndPlanningLevelMaterialDetailLevel,
        });
        done();
      });
    });

    it('should return an empty content array when no customer is selected', (done) => {
      Stub.setInput('customer', { customerName: '', customerNumber: '' });

      component['getData$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response.content).toEqual([]);
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
      const getDataPathSpy = jest.spyOn<any, any>(component, 'getDataPath');
      const reloadSpy = jest.spyOn(component as any, 'loadData');

      component['setConfig'](mockColumnDefs);

      expect(configSetSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            tableId: 'sales-planning-customer-details-yearly',
            columnDefs: [
              {
                columnDefs: mockColumnDefs,
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
            context: expect.objectContaining({
              numberPipe: component['numberPipe'],
              reloadData: expect.any(Function),
            }),
            customTreeData: expect.objectContaining({
              autoGroupColumnDef: expect.objectContaining({
                headerName: 'sales_planning.table.autoGroupColumn',
                colId: 'autoGroup',
                rowGroup: true,
                filter: AgGridFilterType.Text,
                cellRenderer: SalesPlanningGroupLevelCellRendererComponent,
                cellRendererParams: expect.objectContaining({
                  clickAction: expect.any(Function),
                }),
              }),
              getDataPath: expect.any(Function),
            }),
            getRowId: expect.any(Function),
            sideBar: expect.objectContaining({
              toolPanels: [expect.any(Object)],
            }),
            noRowsMessage: 'sales_planning.table.no_data',
          }),
          isLoading$: expect.any(Object),
          hasTabView: true,
          renderFloatingFilter: false,
          maxAllowedTabs: 5,
        })
      );

      // Test the reloadData function
      const reloadDataFn =
        configSetSpy.mock.calls[0][0].table.context.reloadData;
      reloadDataFn();
      expect(reloadSpy).toHaveBeenCalled();

      // Test the getDataPath function
      const mockData = { planningYear: '2023', planningMaterial: 'Material1' };
      getDataPathSpy.mockReturnValue(['2023', 'Material1']);
      const dataPathFn =
        configSetSpy.mock.calls[0][0].table.customTreeData.getDataPath;
      expect(dataPathFn(mockData)).toEqual(['2023', 'Material1']);
    });
  });

  describe('setColumnDefinitions', () => {
    it('should configure the table with the correct column definitions', () => {
      const mockColumnDefinitions = [
        {
          colId: 'col1',
          title: 'Column 1',
          filter: 'agTextColumnFilter',
          filterParams: {},
          cellRenderer: null,
          cellRendererParams: null,
          visible: true,
          sortable: true,
          sort: 'asc',
          alwaysVisible: false,
          valueFormatter: null,
          maxWidth: 200,
          tooltipComponent: null,
          tooltipComponentParams: null,
          tooltipField: null,
        },
      ] as any;
      const getColumnDefinitionsSpy = jest
        .spyOn(Helper, 'getColumnDefinitions')
        .mockReturnValue(mockColumnDefinitions);

      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');

      component['setColumnDefinitions']();

      expect(getColumnDefinitionsSpy).toHaveBeenCalledWith(
        Helper.TimeScope.Yearly
      );
      expect(setConfigSpy).toHaveBeenCalledWith([
        {
          alwaysVisible: false,
          cellRenderer: null,
          cellRendererParams: null,
          colId: 'col1',
          field: 'col1',
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            closeOnApply: true,
            filterOptions: ['equals', 'contains', 'startsWith', 'endsWith'],
            maxNumConditions: 1,
            numberParser: expect.any(Function),
          },
          headerName: 'Column 1',
          headerTooltip: 'Column 1',
          hide: false,
          key: 'col1',
          lockPinned: true,
          maxWidth: 200,
          resizable: true,
          sort: 'asc',
          sortable: true,
          suppressHeaderFilterButton: true,
          suppressHeaderMenuButton: true,
          tooltipComponent: null,
          tooltipComponentParams: null,
          tooltipField: null,
          valueFormatter: null,
          visible: true,
        },
      ]);
    });
  });

  describe('handlePlanningLevelModalClicked', () => {
    it('should open the modal and update planning level material when newPlanningLevelMaterialType is provided', () => {
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () =>
            of({
              deleteExistingPlanningData: false,
              newPlanningLevelMaterialType: 'NewType',
            }),
        } as any);

      const planningLevelMaterialSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      component['handlePlanningLevelModalClicked']();

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        autoFocus: false,
        data: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
          planningLevelMaterial: {
            isDefaultPlanningLevelMaterialType: true,
            planningLevelMaterialType: 'GP',
          },
        },
        disableClose: true,
        maxWidth: '900px',
        width: '600px',
      });

      expect(planningLevelMaterialSpy).toHaveBeenCalledWith({
        isDefaultPlanningLevelMaterialType: true,
        planningLevelMaterialType: 'NewType',
      });
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should delete existing planning data when deleteExistingPlanningData is true', () => {
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () =>
          of({
            deleteExistingPlanningData: true,
            newPlanningLevelMaterialType: 'NewType',
          }),
      } as any);

      const deleteMaterialTypeSpy = jest.spyOn(
        component['planningLevelService'],
        'deleteMaterialTypeByCustomerNumber'
      );

      component['handlePlanningLevelModalClicked']();

      expect(deleteMaterialTypeSpy).toHaveBeenCalledWith('0000086023');
    });

    it('should not update planning level material when newPlanningLevelMaterialType is not provided', () => {
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of({}),
        } as any);

      const planningLevelMaterialSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );

      component['handlePlanningLevelModalClicked']();

      expect(dialogSpy).toHaveBeenCalled();
      expect(planningLevelMaterialSpy).not.toHaveBeenCalled();
    });
  });

  describe('toggleSection', () => {
    it('should toggle the collapsedSection signal value', () => {
      const updateSpy = jest.spyOn(component['collapsedSection'], 'update');

      // Initial state
      component['collapsedSection'].set(false);

      // Toggle to true
      component['toggleSection']();
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(component['collapsedSection']()).toBe(true);

      // Toggle back to false
      component['toggleSection']();
      expect(updateSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(component['collapsedSection']()).toBe(false);
    });
  });

  describe('handleChartHistoryModalClicked', () => {
    it('should open the CustomerPlanningDetailsChangeHistoryModalComponent with the correct configuration', () => {
      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['handleChartHistoryModalClicked']();

      expect(dialogSpy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          data: {
            customerName: 'Tesla Inc',
            customerNumber: '0000086023',
          },
          minWidth: '75vw',
          maxWidth: '100vw',
          autoFocus: false,
          disableClose: true,
          panelClass: 'resizable',
        })
      );
    });
  });

  describe('handleYearlyAggregationClicked', () => {
    it('should open the MonthlyCustomerPlanningDetailsModalComponent with correct data for yearly aggregation row', () => {
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true),
        } as any);

      const loadDataSpy = jest.spyOn<any, any>(component, 'loadData');

      const rowData = {
        planningYear: '2023',
        planningMaterial: 'Material1',
        planningMaterialText: 'Material Text',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 500,
      } as any;

      component['handleYearlyAggregationClicked'](rowData, true);

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        autoFocus: false,
        data: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
          detailLevel: '3',
          planningCurrency: 'USD',
          planningEntry: '',
          planningLevelMaterialType: 'GP',
          planningMaterial: 'Material1',
          planningYear: '2023',
          totalSalesPlanAdjusted: 500,
          totalSalesPlanUnconstrained: 1000,
        },
        disableClose: true,
        hasBackdrop: false,
        height: '100vh',
        panelClass: 'monthly-customer-planning-details',
        width: '100vw',
      });

      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should open the MonthlyCustomerPlanningDetailsModalComponent with correct data for non-yearly aggregation row', () => {
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(false),
        } as any);

      const rowData = {
        planningYear: '2023',
        planningMaterial: 'Material1',
        planningMaterialText: 'Material Text',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 500,
      } as any;

      component['handleYearlyAggregationClicked'](rowData, false);

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        autoFocus: false,
        data: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
          detailLevel: '4',
          planningCurrency: 'USD',
          planningEntry: 'Material1 - Material Text',
          planningLevelMaterialType: 'GP',
          planningMaterial: 'Material1',
          planningYear: '2023',
          totalSalesPlanAdjusted: 500,
          totalSalesPlanUnconstrained: 1000,
        },
        disableClose: true,
        hasBackdrop: false,
        height: '100vh',
        panelClass: 'monthly-customer-planning-details',
        width: '100vw',
      });
    });
  });

  describe('getDataPath', () => {
    it('should return an empty array if data is null or undefined', () => {
      expect(component['getDataPath'](null)).toEqual([]);
      expect(component['getDataPath'](undefined as any)).toEqual([]);
    });

    it('should return an array with only the planningYear if planningMaterial is not present', () => {
      const data = { planningYear: '2023', planningMaterial: null } as any;
      expect(component['getDataPath'](data)).toEqual(['2023']);
    });

    it('should return an array with planningYear and planningMaterial if both are present', () => {
      const data = {
        planningYear: '2023',
        planningMaterial: 'Material1',
      } as any;
      expect(component['getDataPath'](data)).toEqual(['2023', 'Material1']);
    });
  });

  describe('fetchPlanningLevelMaterial', () => {
    it('should fetch planning level material and update the configuration', () => {
      const planningLevelServiceSpy = jest.spyOn(
        component['planningLevelService'],
        'getMaterialTypeByCustomerNumber'
      );
      const planningLevelMaterialSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      planningLevelServiceSpy.mockReturnValue(
        of({ planningLevelMaterialType: 'GP' }) as any
      );

      component['fetchPlanningLevelMaterial']('12345');

      expect(planningLevelServiceSpy).toHaveBeenCalledWith('12345');
      expect(planningLevelMaterialSpy).toHaveBeenCalledWith({
        planningLevelMaterialType: 'GP',
      });
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('loadData', () => {
    it('should call fetchPlanningLevelMaterial with the correct customer number', () => {
      const fetchPlanningLevelMaterialSpy = jest.spyOn<any, any>(
        component,
        'fetchPlanningLevelMaterial'
      );

      component['loadData']();

      expect(fetchPlanningLevelMaterialSpy).toHaveBeenCalledWith('0000086023');
    });
  });

  describe('isCustomerSelected', () => {
    it('should return true when customer has name and number', () => {
      Stub.setInput('customer', {
        customerName: 'Customer A',
        customerNumber: '12345',
        planningCurrency: 'USD',
      });
      Stub.detectChanges();

      expect(component['isCustomerSelected']()).toBe(true);
    });

    it('should return false when customer has no name', () => {
      Stub.setInput('customer', {
        customerName: '',
        customerNumber: '12345',
        planningCurrency: 'USD',
      });
      Stub.detectChanges();

      expect(component['isCustomerSelected']()).toBe(false);
    });

    it('should return false when customer has no number', () => {
      Stub.setInput('customer', {
        customerName: 'Customer A',
        customerNumber: '',
        planningCurrency: 'USD',
      });

      Stub.detectChanges();

      expect(component['isCustomerSelected']()).toBe(false);
    });
  });

  describe('table configuration', () => {
    it('should have fullscreen functionality', () => {
      const toggleFullscreenSpy = jest.fn(() => 'Fullscreen toggled');
      Stub.setInput('toggleFullscreen', toggleFullscreenSpy);
      Stub.setInput('tableInFullscreen', true);
      Stub.detectChanges();

      expect(component['tableInFullscreen']()).toBe(true);
      expect(component['toggleFullscreen']()()).toBe('Fullscreen toggled');
      expect(toggleFullscreenSpy).toHaveBeenCalled();
    });
  });

  describe('collapsedSection', () => {
    it('should initialize with false value', () => {
      expect(component['collapsedSection']()).toBe(false);
    });
  });

  describe('openComments', () => {
    it('should open comments modal with correct customer data', () => {
      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['openComments']();

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        data: {
          customerName: 'Tesla Inc',
          customerNumber: '0000086023',
        },
        minWidth: '350px',
        width: '100%',
        maxWidth: '560px',
        minHeight: '300px',
        maxHeight: '840px',
        height: '100%',
        autoFocus: false,
      });
    });
  });

  describe('integration tests', () => {
    it('should handle empty data response gracefully', () => {
      jest
        .spyOn(
          component['salesPlanningService'],
          'getDetailedCustomerSalesPlan'
        )
        .mockReturnValue(of({ content: [] } as any));

      component['loadData']();

      expect(component).toBeTruthy();
    });

    it('should update data when customer changes', () => {
      const loadDataSpy = jest.spyOn<any, any>(component, 'loadData');

      // Initial customer is already set in beforeEach

      // Change to a different customer
      Stub.setInput('customer', {
        customerName: 'New Customer',
        customerNumber: '9999999',
        planningCurrency: 'EUR',
      });
      Stub.detectChanges();

      // Verify loadData was called
      expect(loadDataSpy).toHaveBeenCalled();

      // Verify planningLevelMaterialConfiguration was reset
      expect(component['planningLevelMaterialConfiguration']()).toEqual({
        isDefaultPlanningLevelMaterialType: true,
        planningLevelMaterialType: 'GP',
      });
    });

    it('should handle API errors gracefully when fetching planning level material', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const planningLevelServiceSpy = jest
        .spyOn(
          component['planningLevelService'],
          'getMaterialTypeByCustomerNumber'
        )
        .mockReturnValue(throwError(() => new Error('API Error')));

      // This shouldn't throw an error that breaks the test
      expect(() =>
        component['fetchPlanningLevelMaterial']('12345')
      ).not.toThrow();

      expect(planningLevelServiceSpy).toHaveBeenCalledWith('12345');
      consoleErrorSpy.mockRestore();
    });

    it('should handle complex data path scenarios', () => {
      // Test with various data structures
      const testCases = [
        {
          data: { planningYear: '2023', planningMaterial: 'Material1' },
          expected: ['2023', 'Material1'],
        },
        {
          data: { planningYear: '2023', planningMaterial: '' },
          expected: ['2023'],
        },
        {
          data: { planningYear: '2023', planningMaterial: null },
          expected: ['2023'],
        },
        {
          data: { planningYear: '', planningMaterial: 'Material1' },
          expected: ['', 'Material1'],
        },
      ];

      testCases.forEach((testCase) => {
        expect(component['getDataPath'](testCase.data as any)).toEqual(
          testCase.expected
        );
      });
    });

    it('should properly integrate with planning level service', () => {
      const mockPlanningLevelMaterial = {
        planningLevelMaterialType: 'GP',
        isDefaultPlanningLevelMaterialType: true,
      };

      const planningLevelServiceSpy = jest
        .spyOn(
          component['planningLevelService'],
          'getMaterialTypeByCustomerNumber'
        )
        .mockReturnValue(of(mockPlanningLevelMaterial as any));

      const configSetSpy = jest.spyOn(
        component['planningLevelMaterialConfiguration'],
        'set'
      );

      component['fetchPlanningLevelMaterial']('0000086023');

      expect(planningLevelServiceSpy).toHaveBeenCalledWith('0000086023');
      expect(configSetSpy).toHaveBeenCalledWith(mockPlanningLevelMaterial);
    });
  });
});
