import { fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { GridApi, GridReadyEvent } from 'ag-grid-enterprise';

import {
  DetailedCustomerSalesPlan,
  SalesPlanningDetailLevel,
} from '../../../../feature/sales-planning/model';
import { Stub } from '../../../../shared/test/stub.class';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { CustomerPlanningDetailsChangeHistoryModalComponent } from '../customer-planning-details-change-history-modal/customer-planning-details-change-history-modal.component';
import { CustomerPlanningDetailsComponent } from './customer-planning-details.component';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal/monthly-customer-planning-details-modal.component';

describe('CustomerPlanningDetailsComponent', () => {
  let component: CustomerPlanningDetailsComponent;
  let mockTranslocoLocaleService: jest.Mocked<TranslocoLocaleService>;
  let gridApiMock: GridApi;

  beforeEach(() => {
    gridApiMock = {
      setGridOption: jest.fn(),
      getDisplayedRowCount: jest.fn().mockReturnValue(10),
      redrawRows: jest.fn(),
    } as unknown as GridApi;

    mockTranslocoLocaleService = {
      getLocale: jest.fn().mockReturnValue('en'),
    } as unknown as jest.Mocked<TranslocoLocaleService>;

    Object.defineProperty(ValidationHelper, 'localeService', {
      value: mockTranslocoLocaleService,
      writable: true,
      configurable: true,
    });

    component = Stub.getForEffect<CustomerPlanningDetailsComponent>({
      component: CustomerPlanningDetailsComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getPlanningLevelServiceProvider(),
        Stub.getPlanningLevelServiceProvider(),
        Stub.getYearlyCustomerPlanningDetailsColumnSettingsServiceProvider(),
      ],
    });

    component.onGridReady({
      api: gridApiMock,
    } as GridReadyEvent);

    Stub.setInputs([
      { property: 'customerName', value: 'Tesla Inc' },
      { property: 'customerNumber', value: '0000086023' },
      { property: 'planningCurrency', value: 'USD' },
      { property: 'openFullscreen', value: false },
      { property: 'collapsedSection', value: false },
    ]);

    Stub.detectChanges();
  });

  it('should fetch planning level material on initialization', () => {
    expect(
      component['planningLevelService'].getMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should close dialog and delete data when modal confirms deletion', () => {
    jest.spyOn(component['dialog'], 'open').mockImplementation(
      () =>
        ({
          afterClosed: jest.fn().mockReturnValue(
            of({
              deleteExistingPlanningData: true,
              newPlanningLevelMaterialType: null,
            })
          ),
        }) as any
    );

    component.handlePlanningLevelModalClicked();

    expect(
      component['planningLevelService'].deleteMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should override the planning level material when changed in dialog', fakeAsync(() => {
    jest.spyOn(component['dialog'], 'open').mockImplementation(
      () =>
        ({
          afterClosed: jest.fn().mockReturnValue(
            of({
              deleteExistingPlanningData: false,
              newPlanningLevelMaterialType: 'PL',
            })
          ),
        }) as any
    );

    component.handlePlanningLevelModalClicked();

    tick();

    expect(
      component.planningLevelMaterialConfiguration().planningLevelMaterialType
    ).toBe('PL');
  }));

  it('should not delete data when modal does not confirm deletion', () => {
    jest.spyOn(component['dialog'], 'open').mockReturnValue({
      afterClosed: jest.fn(() =>
        of({
          deleteExistingPlanningData: false,
          newPlanningLevelMaterialType: null,
        })
      ),
    } as any);

    component.handlePlanningLevelModalClicked();

    expect(
      component['planningLevelService'].deleteMaterialTypeByCustomerNumber
    ).not.toHaveBeenCalled();
  });

  describe('onFilterChanged', () => {
    it('should update row count on filter change', () => {
      component.onFilterChanged();

      expect(component.rowCount()).toBe(10);
    });
  });

  describe('handleChartHistoryModalClicked', () => {
    it('should open the change history dialog with the selected customer', () => {
      Stub.setInputs([
        { property: 'customerName', value: 'customer 1' },
        { property: 'customerNumber', value: '1' },
      ]);

      const dialogSpy = jest.spyOn(component['dialog'], 'open');

      component['handleChartHistoryModalClicked']();
      expect(dialogSpy).toHaveBeenCalledWith(
        CustomerPlanningDetailsChangeHistoryModalComponent,
        expect.objectContaining({
          data: { customerName: 'customer 1', customerNumber: '1' },
        })
      );
    });
  });

  describe('reloadData', () => {
    it('should call setYearlyPlanningData with the correct planningLevelMaterialType', () => {
      const setYearlyPlanningDataSpy = jest.spyOn(
        component as any,
        'setYearlyPlanningData'
      );
      const fetchPlanningLevelMaterialSpy = jest.spyOn(
        component as any,
        'fetchPlanningLevelMaterial'
      );

      const mockPlanningLevelMaterialType = 'PL';
      component['planningLevelMaterialConfiguration'].set({
        planningLevelMaterialType: mockPlanningLevelMaterialType,
      } as any);

      component['reloadData']();

      expect(setYearlyPlanningDataSpy).toHaveBeenCalledWith(
        mockPlanningLevelMaterialType
      );
      expect(fetchPlanningLevelMaterialSpy).toHaveBeenCalledWith(
        component.customerNumber()
      );
    });

    it('should call fetchPlanningLevelMaterial with the correct customerNumber', () => {
      const fetchPlanningLevelMaterialSpy = jest.spyOn(
        component as any,
        'fetchPlanningLevelMaterial'
      );

      component['reloadData']();

      expect(fetchPlanningLevelMaterialSpy).toHaveBeenCalledWith(
        component.customerNumber()
      );
    });
  });

  describe('handleYearlyAggregationClicked', () => {
    it('should open the modal with MonthlyOnlyDetailLevel when isYearlyAggregationRowClicked is true', () => {
      const rowData: DetailedCustomerSalesPlan = {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningYear: '2025',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 900,
      } as any;

      const isYearlyAggregationRowClicked = true;

      component.handleYearlyAggregationClicked(
        rowData,
        isYearlyAggregationRowClicked
      );

      expect(component['dialog'].open).toHaveBeenCalledWith(
        MonthlyCustomerPlanningDetailsModalComponent,
        expect.objectContaining({
          data: {
            detailLevel: SalesPlanningDetailLevel.MonthlyOnlyDetailLevel,
            planningEntry: '',
            customerNumber: component.customerNumber(),
            customerName: component.customerName(),
            planningCurrency: component.planningCurrency(),
            planningYear: rowData.planningYear,
            planningMaterial: rowData.planningMaterial,
            planningLevelMaterialType:
              component.planningLevelMaterialConfiguration()
                .planningLevelMaterialType,
            totalSalesPlanUnconstrained: rowData.totalSalesPlanUnconstrained,
            totalSalesPlanAdjusted: rowData.totalSalesPlanAdjusted,
          },
          autoFocus: false,
          disableClose: true,
          hasBackdrop: false,
          panelClass: 'monthly-customer-planning-details',
          width: '100vw',
          height: '100vh',
        })
      );
    });

    it('should open the modal with MonthlyAndPlanningLevelMaterialDetailLevel when isYearlyAggregationRowClicked is false', () => {
      const rowData: DetailedCustomerSalesPlan = {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningYear: '2025',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 900,
      } as any;

      const isYearlyAggregationRowClicked = false;

      component.handleYearlyAggregationClicked(
        rowData,
        isYearlyAggregationRowClicked
      );

      expect(component['dialog'].open).toHaveBeenCalledWith(
        MonthlyCustomerPlanningDetailsModalComponent,
        expect.objectContaining({
          data: {
            detailLevel:
              SalesPlanningDetailLevel.MonthlyAndPlanningLevelMaterialDetailLevel,
            planningEntry: 'I03 - Bearings',
            customerNumber: component.customerNumber(),
            customerName: component.customerName(),
            planningCurrency: component.planningCurrency(),
            planningYear: rowData.planningYear,
            planningMaterial: rowData.planningMaterial,
            planningLevelMaterialType:
              component.planningLevelMaterialConfiguration()
                .planningLevelMaterialType,
            totalSalesPlanUnconstrained: rowData.totalSalesPlanUnconstrained,
            totalSalesPlanAdjusted: rowData.totalSalesPlanAdjusted,
          },
          autoFocus: false,
          disableClose: true,
          hasBackdrop: false,
          panelClass: 'monthly-customer-planning-details',
          width: '100vw',
          height: '100vh',
        })
      );
    });

    it('should call reloadData when the modal is closed with reloadData set to true and detailLevel is MonthlyOnlyDetailLevel', () => {
      const reloadDataSpy = jest.spyOn(component as any, 'reloadData');
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      } as any);

      const rowData: DetailedCustomerSalesPlan = {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningYear: '2025',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 900,
      } as any;

      const isYearlyAggregationRowClicked = true;

      component.handleYearlyAggregationClicked(
        rowData,
        isYearlyAggregationRowClicked
      );

      expect(reloadDataSpy).toHaveBeenCalled();
    });

    it('should not call reloadData when the modal is closed with reloadData set to false', () => {
      const reloadDataSpy = jest.spyOn(component as any, 'reloadData');
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(false)),
      } as any);

      const rowData: DetailedCustomerSalesPlan = {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningYear: '2025',
        totalSalesPlanUnconstrained: 1000,
        totalSalesPlanAdjusted: 900,
      } as any;

      const isYearlyAggregationRowClicked = true;

      component.handleYearlyAggregationClicked(
        rowData,
        isYearlyAggregationRowClicked
      );

      expect(reloadDataSpy).not.toHaveBeenCalled();
    });
  });
});
