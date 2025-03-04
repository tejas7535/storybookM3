import { fakeAsync, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { AuthService } from '../../../../../../../shared/utils/auth/auth.service';
import { CustomerSalesPlanSinglePercentageEditModalComponent } from '../../../customer-sales-plan-single-percentage-edit-modal/customer-sales-plan-single-percentage-edit-modal.component';
import {
  PercentageEditOption,
  SalesPlanningSinglePercentageEditCellRendererComponent,
} from './sales-planning-single-percentage-edit-cell-renderer.component';

describe('SalesPlanningSinglePercentageEditCellRendererComponent with Spectator', () => {
  let spectator: Spectator<SalesPlanningSinglePercentageEditCellRendererComponent>;

  const mockReloadData = jest.fn();

  const mockDialogRef = {
    afterClosed: jest.fn().mockReturnValue(of(null)),
  };

  const mockParams: ICellRendererParams & {
    percentageValueName: string;
    percentageEditOption: PercentageEditOption;
  } = {
    value: 10,
    valueFormatted: '10%',
    data: {
      customerNumber: '12345',
      planningYear: '2024',
      planningCurrency: 'EUR',
      totalSalesPlanUnconstrained: 1000,
      salesPlanUnconstrained: 900,
    },
    node: { level: 0 },
    context: {
      reloadData: mockReloadData,
    },
    formatValue: (value: number) => `${value}%`,
    percentageValueName: 'Test Percentage',
    percentageEditOption: PercentageEditOption.SalesDeduction,
  } as any;

  const createComponent = createComponentFactory({
    component: SalesPlanningSinglePercentageEditCellRendererComponent,
    imports: [SalesPlanningSinglePercentageEditCellRendererComponent],
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn().mockReturnValue(mockDialogRef),
      }),
      mockProvider(SalesPlanningService, {
        updateSalesDeductions: jest.fn().mockReturnValue(of(0)),
        updateCashDiscounts: jest.fn().mockReturnValue(of(0)),
      }),
      mockProvider(AuthService, {
        hasUserAccess: jest.fn().mockReturnValue(of(true)),
      }),
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should initialize with correct values', () => {
      spectator.component.setValue(mockParams);
      expect(spectator.component['customerNumber']).toBe('12345');
      expect(spectator.component['planningYear']).toBe('2024');
      expect(spectator.component['planningCurrency']).toBe('EUR');
      expect(spectator.component['percentageValueName']).toBe(
        'Test Percentage'
      );
      expect(spectator.component['percentageEditOption']).toBe(
        PercentageEditOption.SalesDeduction
      );
      expect(spectator.component.isYearlyRow).toBe(true);
      expect(spectator.component.valueFormatted()).toBe('10%');
    });

    it('should set isYearlyRow to false for non-yearly row', () => {
      const params = { ...mockParams, node: { level: 1 } };
      spectator.component.setValue(
        params as ICellRendererParams & {
          percentageValueName: string;
          percentageEditOption: PercentageEditOption;
        }
      );
      expect(spectator.component.isYearlyRow).toBe(false);
    });
  });

  describe('permissions', () => {
    it('should check user permissions on initialization', () => {
      const authService = spectator.inject(AuthService);
      spectator.component.setValue(mockParams);
      expect(authService.hasUserAccess).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should not show edit button if user lacks permission', () => {
      const authService = spectator.inject(AuthService);
      (authService.hasUserAccess as jest.Mock).mockReturnValue(of(false));
      spectator.component.setValue(mockParams);
      spectator.detectChanges();
      const button = spectator.query('button');
      expect(button).toBeNull();
    });
  });

  describe('handleEditSinglePercentageValueClicked', () => {
    it('should open dialog with correct data', () => {
      const dialog = spectator.inject(MatDialog);

      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(null)),
      };

      (dialog.open as jest.Mock).mockReturnValue(dialogRef);

      spectator.component.setValue(mockParams);
      spectator.component.handleEditSinglePercentageValueClicked();

      expect(dialog.open).toHaveBeenCalledWith(
        CustomerSalesPlanSinglePercentageEditModalComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            title: expect.stringContaining('Test Percentage'),
            previousValue: '10%',
            referenceValue: 1000,
            planningCurrency: 'EUR',
          }),
        })
      );
    });

    it('should update value after dialog close by reloading data', fakeAsync(() => {
      const dialog = spectator.inject(MatDialog);

      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(20)),
      };

      (dialog.open as jest.Mock).mockReturnValue(dialogRef);

      spectator.component.setValue(mockParams);
      spectator.component.handleEditSinglePercentageValueClicked();

      tick();

      expect(mockReloadData).toHaveBeenCalled();
    }));

    it('should not update value if dialog returns null', fakeAsync(() => {
      const dialog = spectator.inject(MatDialog);
      const dialogRef = {
        afterClosed: jest.fn().mockReturnValue(of(null)),
      };

      (dialog.open as jest.Mock).mockReturnValue(dialogRef);

      spectator.component.setValue(mockParams);
      spectator.component.handleEditSinglePercentageValueClicked();

      tick();

      expect(spectator.component.value).toBe(10);
      expect(spectator.component.valueFormatted()).toBe('10%');
    }));
  });

  describe('updateAdjustedPercentage', () => {
    it('should update sales deductions', () => {
      const salesPlanningService = spectator.inject(SalesPlanningService);
      spectator.component.setValue(mockParams);
      spectator.component['updateAdjustedPercentage'](15);
      expect(salesPlanningService.updateSalesDeductions).toHaveBeenCalledWith(
        '12345',
        '2024',
        15
      );
    });

    it('should update cash discounts', () => {
      const salesPlanningService = spectator.inject(SalesPlanningService);
      const params = {
        ...mockParams,
        percentageEditOption: PercentageEditOption.CashDiscount,
      };
      spectator.component.setValue(params);
      spectator.component['updateAdjustedPercentage'](15);
      expect(salesPlanningService.updateCashDiscounts).toHaveBeenCalledWith(
        '12345',
        '2024',
        15
      );
    });
  });
});
