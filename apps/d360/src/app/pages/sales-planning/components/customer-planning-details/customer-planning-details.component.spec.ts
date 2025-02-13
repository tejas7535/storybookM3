import { fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { GridApi, GridReadyEvent } from 'ag-grid-enterprise';
import { MockComponent } from 'ng-mocks';

import {
  DetailedCustomerSalesPlan,
  SalesPlanningDetailLevel,
} from '../../../../feature/sales-planning/model';
import { PlanningLevelService } from '../../../../feature/sales-planning/planning-level.service';
import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { CustomerPlanningDetailsComponent } from './customer-planning-details.component';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal/monthly-customer-planning-details-modal.component';
import { YearlyCustomerPlanningDetailsColumnSettingsService } from './service/customer-planning-details-column-settings.service';

describe('CustomerPlanningDetailsComponent', () => {
  let spectator: Spectator<CustomerPlanningDetailsComponent>;
  let mockTranslocoLocaleService: jest.Mocked<TranslocoLocaleService>;
  let gridApiMock: GridApi;

  const dialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: jest.fn().mockReturnValue(
        of({
          deleteExistingPlanningData: false,
          newPlanningLevelMaterialType: 'PL',
        })
      ),
    }),
  };

  const planningLevelServiceMock = {
    getMaterialTypeByCustomerNumber: jest.fn().mockReturnValue(
      of({
        planningLevelMaterialType: 'GP',
        isDefaultPlanningLevelMaterialType: true,
      })
    ),
    deleteMaterialTypeByCustomerNumber: jest.fn(() => of(null)),
  };

  const salesPlanningServiceMock = {
    getDetailedCustomerSalesPlan: jest.fn(() => of([])),
  };

  const createComponent = createComponentFactory({
    component: CustomerPlanningDetailsComponent,
    imports: [MockComponent(TableToolbarComponent)],
    providers: [
      { provide: MatDialog, useValue: dialogMock },
      { provide: PlanningLevelService, useValue: planningLevelServiceMock },
      { provide: SalesPlanningService, useValue: salesPlanningServiceMock },
      mockProvider(YearlyCustomerPlanningDetailsColumnSettingsService, {
        getColumnSettings: jest.fn(() => of([])),
      }),
    ],
  });

  beforeEach(() => {
    gridApiMock = {
      setGridOption: jest.fn(),
      getDisplayedRowCount: jest.fn().mockReturnValue(10),
    } as unknown as GridApi;

    mockTranslocoLocaleService = {
      getLocale: jest.fn().mockReturnValue('en'),
    } as unknown as jest.Mocked<TranslocoLocaleService>;

    Object.defineProperty(ValidationHelper, 'localeService', {
      value: mockTranslocoLocaleService,
      writable: true,
      configurable: true,
    });

    jest.clearAllMocks();

    spectator = createComponent({
      props: {
        customerName: 'Tesla Inc',
        customerNumber: '0000086023',
        planningCurrency: 'USD',
        openFullscreen: false,
        toggleFullscreen: jest.fn(),
        collapsedSection: false,
        toggleSection: jest.fn(),
      },
    });

    const gridReadyEvent = {
      api: gridApiMock,
    } as GridReadyEvent;

    spectator.component.onGridReady(gridReadyEvent);
  });

  it('should display the title text', () => {
    const titleElement = spectator.query('h2.text-title-large');
    expect(titleElement).toHaveText('sales_planning.planning_details.title');
  });

  it('should fetch planning level material on initialization', () => {
    expect(
      planningLevelServiceMock.getMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should close dialog and delete data when modal confirms deletion', () => {
    jest.spyOn(dialogMock, 'open').mockImplementation(
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

    spectator.component.handlePlanningLevelModalClicked();

    expect(
      planningLevelServiceMock.deleteMaterialTypeByCustomerNumber
    ).toHaveBeenCalledWith('0000086023');
  });

  it('should override the planning level material when changed in dialog', fakeAsync(() => {
    jest.spyOn(dialogMock, 'open').mockImplementation(
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

    spectator.component.handlePlanningLevelModalClicked();

    tick();

    expect(
      spectator.component.planningLevelMaterialConfiguration()
        .planningLevelMaterialType
    ).toBe('PL');
  }));

  it('should update row count on filter change', () => {
    spectator.component.onFilterChanged();

    expect(spectator.component.rowCount()).toBe(10);
  });

  it('should not delete data when modal does not confirm deletion', () => {
    dialogMock.open = jest.fn(() => ({
      afterClosed: jest.fn(() =>
        of({
          deleteExistingPlanningData: false,
          newPlanningLevelMaterialType: null,
        })
      ),
    }));

    spectator.component.handlePlanningLevelModalClicked();

    expect(
      planningLevelServiceMock.deleteMaterialTypeByCustomerNumber
    ).not.toHaveBeenCalled();
  });

  it('should open modal for yearly row when handleYearlyAggregationClicked is called', () => {
    const rowData: DetailedCustomerSalesPlan = {
      planningMaterial: 'I03',
      planningMaterialText: 'Bearings',
      planningYear: '2025',
      totalSalesPlanUnconstrained: 1000,
      totalSalesPlanAdjusted: 900,
    } as any;

    const isYearlyRow = true;
    spectator.component.handleYearlyAggregationClicked(rowData, isYearlyRow);

    expect(dialogMock.open).toHaveBeenCalledWith(
      MonthlyCustomerPlanningDetailsModalComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          detailLevel: SalesPlanningDetailLevel.MonthlyOnlyDetailLevel,
          planningEntry: '',
          customerNumber: expect.any(String),
          customerName: expect.any(String),
          planningCurrency: expect.any(String),
          planningYear: expect.any(String),
          planningLevelMaterialType: expect.any(String),
          totalSalesPlanUnconstrained: expect.any(Number),
          totalSalesPlanAdjusted: expect.any(Number),
        }),
        autoFocus: false,
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'monthly-customer-planning-details',
        width: '100vw',
        height: '100vh',
      })
    );
  });
  it('should open modal for yearly planning material row when handleYearlyAggregationClicked is called', () => {
    const rowData: DetailedCustomerSalesPlan = {
      planningMaterial: 'I03',
      planningMaterialText: 'Bearings',
      planningYear: '2025',
      totalSalesPlanUnconstrained: 1000,
      totalSalesPlanAdjusted: 900,
    } as any;

    const isYearlyRow = false;
    spectator.component.handleYearlyAggregationClicked(rowData, isYearlyRow);

    expect(dialogMock.open).toHaveBeenCalledWith(
      MonthlyCustomerPlanningDetailsModalComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          detailLevel:
            SalesPlanningDetailLevel.MonthlyAndPlanningLevelMaterialDetailLevel,
          planningEntry: 'I03 - Bearings',
          customerNumber: expect.any(String),
          customerName: expect.any(String),
          planningCurrency: expect.any(String),
          planningYear: expect.any(String),
          planningLevelMaterialType: expect.any(String),
          totalSalesPlanUnconstrained: expect.any(Number),
          totalSalesPlanAdjusted: expect.any(Number),
        }),
        autoFocus: false,
        disableClose: true,
        hasBackdrop: false,
        panelClass: 'monthly-customer-planning-details',
        width: '100vw',
        height: '100vh',
      })
    );
  });
});
