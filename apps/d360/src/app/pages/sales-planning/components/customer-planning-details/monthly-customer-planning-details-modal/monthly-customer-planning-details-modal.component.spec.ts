import { finalize, of, take } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { Stub } from '../../../../../shared/test/stub.class';
import * as Helper from '../column-definition';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal.component';

describe('MonthlyCustomerPlanningDetailsModalComponent', () => {
  let component: MonthlyCustomerPlanningDetailsModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MonthlyCustomerPlanningDetailsModalComponent>(
      {
        component: MonthlyCustomerPlanningDetailsModalComponent,
        providers: [
          Stub.getNumberWithoutFractionDigitsPipeProvider(),
          Stub.getMatDialogDataProvider({
            customerName: 'Test Customer',
            customerNumber: '12345',
            planningCurrency: 'USD',
            planningLevelMaterialType: 'PL',
            planningMaterial: '3',
            planningYear: '2025',
            detailLevel: '3',
            planningEntry: 'F03 Bearings',
            totalSalesPlanUnconstrained: 10_000,
            totalSalesPlanAdjusted: 8000,
          }),
          Stub.getSalesPlanningServiceProvider({
            getDetailedCustomerSalesPlan: [
              { planningMonth: '01', data: 'data1' },
              { planningMonth: '00', data: 'data2' },
            ],
          }),
        ],
      }
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('get title', () => {
    it('should return the correct title', () => {
      expect(component.title).toBe(
        'sales_planning.table.planning 2025 F03 Bearings'
      );
    });
  });

  describe('get subtitle', () => {
    it('should return the correct subtitle when totalSalesPlanAdjusted is not -1', () => {
      const numberPipeSpy = jest
        .spyOn(component['numberWithoutFractionDigitsPipe'], 'transform')
        .mockImplementation((value: any) => value.toString());

      expect(component.subtitle).toBe(
        'sales_planning.table.yearly sales_planning.table.totalSalesPlanUnconstrained: 10000 | sales_planning.table.yearly sales_planning.table.totalSalesPlanAdjusted: 8000 | Test Customer'
      );
      expect(numberPipeSpy).toHaveBeenCalledWith(10_000);
      expect(numberPipeSpy).toHaveBeenCalledWith(8000);
    });

    it('should return the correct subtitle when totalSalesPlanAdjusted is -1', () => {
      (component as any)['data'] = {
        ...component['data'],
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: -1,
        customerName: 'Customer A',
      };

      Stub.detectChanges();

      const numberPipeSpy = jest
        .spyOn(component['numberWithoutFractionDigitsPipe'], 'transform')
        .mockImplementation((value: any) => value.toString());

      expect(component.subtitle).toBe(
        'sales_planning.table.yearly sales_planning.table.totalSalesPlanUnconstrained: 1000 | sales_planning.table.yearly sales_planning.table.totalSalesPlanAdjusted: - | Customer A'
      );
      expect(numberPipeSpy).toHaveBeenCalledWith(1000);
    });
  });

  describe('onClose', () => {
    it('should close the dialog when onClose is called', () => {
      const spy = jest.spyOn(component['dialogRef'], 'close');
      component.onClose();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('getData', () => {
    it('should fetch and filter data correctly', (done) => {
      const salesPlanningServiceSpy = jest.spyOn(
        component['salesPlanningService'],
        'getDetailedCustomerSalesPlan'
      );

      component['getData$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response.content).toEqual([
            { planningMonth: '01', data: 'data1' },
          ]);
          expect(salesPlanningServiceSpy).toHaveBeenCalledWith({
            customerNumber: component['data'].customerNumber,
            planningCurrency: component['data'].planningCurrency,
            planningMaterial: component['data'].planningMaterial,
            planningLevelMaterialType:
              component['data'].planningLevelMaterialType,
            detailLevel: component['data'].detailLevel,
            planningYear: component['data'].planningYear,
          });
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
      const reloadSpy = jest.spyOn(component, 'reload$').mockReturnValue({
        next: jest.fn(),
      } as any);

      component['setConfig'](mockColumnDefs);

      expect(configSetSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            tableId: 'sales-planning-customer-details-monthly',
            context: expect.objectContaining({
              numberPipe: component['numberWithoutFractionDigitsPipe'],
              reloadData: expect.any(Function),
            }),
            columnDefs: [
              {
                columnDefs: mockColumnDefs,
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
            getRowId: expect.any(Function),
            sideBar: { toolPanels: [expect.any(Object)] },
          }),
          isLoading$: component['isLoading$'],
          hasToolbar: false,
          hasTabView: true,
          maxAllowedTabs: 5,
        })
      );

      // Test the reloadData function
      const reloadDataFn =
        configSetSpy.mock.calls[0][0].table.context.reloadData;
      reloadDataFn();
      expect(reloadSpy).toHaveBeenCalled();
      expect(component['hasChangedData']).toBe(true);
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
        Helper.TimeScope.Monthly
      );
      expect(setConfigSpy).toHaveBeenCalledWith([
        {
          key: 'col1',
          colId: 'col1',
          field: 'col1',
          headerName: 'Column 1',
          headerTooltip: 'Column 1',
          filter: 'agTextColumnFilter',
          filterParams: {
            buttons: ['reset', 'apply'],
            closeOnApply: true,
            filterOptions: ['equals', 'contains', 'startsWith', 'endsWith'],
            maxNumConditions: 1,
            numberParser: expect.any(Function),
          },
          cellRenderer: null,
          cellRendererParams: null,
          hide: false,
          sortable: true,
          suppressHeaderFilterButton: true,
          suppressHeaderMenuButton: true,
          sort: 'asc',
          lockVisible: false,
          lockPinned: true,
          valueFormatter: null,
          maxWidth: 200,
          resizable: true,
          tooltipComponent: null,
          tooltipComponentParams: null,
          tooltipField: null,
          visible: true,
        },
      ]);
    });
  });

  it('should generate correct row IDs', () => {
    const mockColumnDefs: ColDef[] = [];
    const configSetSpy = jest.spyOn(component['config'], 'set');

    component['setConfig'](mockColumnDefs);

    // Extract the getRowId function from the call
    const getRowIdFn = configSetSpy.mock.calls[0][0].table.getRowId;

    // Test with sample data
    const result = getRowIdFn({
      data: {
        customerNumber: '12345',
        planningYear: '2025',
        planningMonth: '03',
        planningMaterial: 'MAT001',
      },
    } as any);

    expect(result).toBe('12345-2025-03-MAT001');
  });

  describe('isLoading$ behavior', () => {
    it('should set isLoading to true on first call and false after data is fetched', (done) => {
      jest
        .spyOn(
          component['salesPlanningService'],
          'getDetailedCustomerSalesPlan'
        )
        .mockReturnValue(of([]));

      // Reset the firstCall flag to true
      component['firstCall'] = true;

      // Spy on the isLoading$ next method
      const isLoadingNextSpy = jest.spyOn(component['isLoading$'], 'next');

      component['getData$']()
        .pipe(
          take(1),
          finalize(() => {
            expect(component['firstCall']).toBe(false);
            expect(isLoadingNextSpy).toHaveBeenCalledWith(false);
          })
        )
        .subscribe(() => {
          expect(isLoadingNextSpy).toHaveBeenCalledWith(true);

          done();
        });
    });

    it('should not set isLoading to true on subsequent calls', (done) => {
      jest
        .spyOn(
          component['salesPlanningService'],
          'getDetailedCustomerSalesPlan'
        )
        .mockReturnValue(of([]));

      // Ensure firstCall is false to simulate subsequent calls
      component['firstCall'] = false;

      // Spy on the isLoading$ next method
      const isLoadingNextSpy = jest.spyOn(component['isLoading$'], 'next');

      component['getData$']()
        .pipe(
          take(1),
          finalize(() => {
            // Should only be called with false during finalize
            expect(isLoadingNextSpy).toHaveBeenCalledTimes(1);
            expect(isLoadingNextSpy).toHaveBeenCalledWith(false);
          })
        )
        .subscribe(() => {
          done();
        });
    });
  });

  describe('hasChangedData flag', () => {
    it('should update hasChangedData when reloadData is called', () => {
      component['hasChangedData'] = false;
      const reloadSpy = jest.spyOn(component, 'reload$').mockReturnValue({
        next: jest.fn(),
      } as any);

      // Extract the reloadData function from setConfig
      const configSetSpy = jest.spyOn(component['config'], 'set');
      component['setConfig']([]);
      const reloadDataFn =
        configSetSpy.mock.calls[0][0].table.context.reloadData;

      reloadDataFn();

      expect(component['hasChangedData']).toBe(true);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should return hasChangedData when dialog is closed', () => {
      component['hasChangedData'] = true;
      const dialogCloseSpy = jest.spyOn(component['dialogRef'], 'close');

      component.onClose();

      expect(dialogCloseSpy).toHaveBeenCalledWith(true);
    });
  });
});
