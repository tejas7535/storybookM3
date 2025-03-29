import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { CustomerSalesPlanNumberEditModalComponent } from '../../../customer-sales-plan-number-edit-modal/customer-sales-plan-number-edit-modal.component';
import { SalesPlanningOtherRevenuesCellRendererComponent } from './sales-planning-other-revenues-cell-renderer.component';

describe('SalesPlanningOtherRevenuesCellRendererComponent', () => {
  let spectator: Spectator<SalesPlanningOtherRevenuesCellRendererComponent>;
  let component: SalesPlanningOtherRevenuesCellRendererComponent;
  let dialogService: MatDialog;
  let salesPlanningService: SalesPlanningService;
  let dialogRefMock: Partial<
    MatDialogRef<CustomerSalesPlanNumberEditModalComponent>
  >;

  const mockReloadData = jest.fn();

  const mockCellParams: Partial<ICellRendererParams> & { context: any } = {
    value: 5000,
    valueFormatted: '5,000.00 €',
    data: {
      customerNumber: '12345',
      planningYear: '2026',
      planningCurrency: 'EUR',
      totalSalesPlanUnconstrained: 150_000,
      salesPlanUnconstrained: 145_000,
      cashDiscount: 2,
      salesDeduction: 3,
      editStatus: '1',
    },
    node: {
      level: 0,
    } as any,
    context: {
      reloadData: mockReloadData,
    },
  };

  const createComponent = createComponentFactory({
    component: SalesPlanningOtherRevenuesCellRendererComponent,
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn().mockReturnValue({
          afterClosed: jest.fn().mockReturnValue(of(null)),
        }),
      }),
      mockProvider(SalesPlanningService, {
        updateOtherRevenues: jest.fn().mockReturnValue(of(0)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dialogService = spectator.inject(MatDialog);
    salesPlanningService = spectator.inject(SalesPlanningService);

    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(null)),
    };
    jest
      .spyOn(dialogService, 'open')
      .mockReturnValue(
        dialogRefMock as MatDialogRef<CustomerSalesPlanNumberEditModalComponent>
      );

    component['agInit'](mockCellParams as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set component properties correctly on initialization', () => {
    expect(component['valueFormatted']()).toBe('5,000.00 €');
    expect(component['value']).toBe(5000);
    expect(component['isYearlyRow']).toBe(true);
    expect(component['customerNumber']).toBe('12345');
    expect(component['planningYear']).toBe('2026');
    expect(component['planningCurrency']).toBe('EUR');
    expect(component['onReloadData']).toBe(mockReloadData);
    expect(component['editStatus']()).toBe('1');
  });

  it('should allow editing for yearly rows', () => {
    expect(component.isEditPossible()).toBe(true);
  });

  it('should not allow editing for planning material rows', () => {
    // Test with non-yearly row
    const nonYearlyParams = {
      ...mockCellParams,
      node: { level: 1 } as any,
    };

    component['setValue'](nonYearlyParams as any);

    expect(component.isEditPossible()).toBe(false);
  });

  describe('handleEditOtherRevenuesClicked', () => {
    it('should open dialog with correct parameters', () => {
      component.handleEditOtherRevenuesClicked();

      expect(dialogService.open).toHaveBeenCalledWith(
        CustomerSalesPlanNumberEditModalComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            title:
              'sales_planning.planning_details.edit_modal.otherRevenues sales_planning.planning_details.edit_modal.for 2026',
            planningCurrency: 'EUR',
            previousValue: 5000,
            referenceValue: 150_000,
            previousReferenceValue: 145_000,
          }),
          width: '600px',
          disableClose: true,
        })
      );
    });

    it('should trigger reload data when dialog returns a value', () => {
      jest.spyOn(dialogRefMock, 'afterClosed').mockReturnValue(of(7500));

      component.handleEditOtherRevenuesClicked();

      expect(mockReloadData).toHaveBeenCalled();
    });

    it('should not trigger reload data when dialog returns null', () => {
      jest.spyOn(dialogRefMock, 'afterClosed').mockReturnValue(of(null));

      component.handleEditOtherRevenuesClicked();

      expect(mockReloadData).not.toHaveBeenCalled();
    });
  });

  describe('onSave and onDelete functions', () => {
    it('should call updateOtherRevenues with correct parameters when saving', () => {
      const saveFn = component['onSave']();
      saveFn(7500);

      expect(salesPlanningService.updateOtherRevenues).toHaveBeenCalledWith(
        '12345',
        '2026',
        'EUR',
        7500
      );
    });

    it('should call updateOtherRevenues with zero value when deleting', () => {
      const deleteFn = component['onDelete']();
      deleteFn();

      expect(salesPlanningService.updateOtherRevenues).toHaveBeenCalledWith(
        '12345',
        '2026',
        'EUR',
        0
      );
    });
  });

  it('should calculate reference value correctly', () => {
    const calculateFn = component['calculateReferenceValue']();
    const result = calculateFn(7500);

    // Expected: 150000 * ((100 (%) - 2 (%) - 3 (%)) / 100) + 7500
    // = 150000 * 0.95 + 7500 = 142500 + 7500 = 150000
    expect(result).toBe(150_000);
  });
});
