import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { SalesPlanningService } from '../../../../../../../feature/sales-planning/sales-planning.service';
import { CustomerSalesPlanSinglePercentageEditModalComponent } from '../../../customer-sales-plan-single-percentage-edit-modal/customer-sales-plan-single-percentage-edit-modal.component';
import { Stub } from './../../../../../../../shared/test/stub.class';
import {
  PercentageEditOption,
  SalesPlanningSinglePercentageEditCellRendererComponent,
} from './sales-planning-single-percentage-edit-cell-renderer.component';

describe('SalesPlanningSinglePercentageEditCellRendererComponent', () => {
  let component: SalesPlanningSinglePercentageEditCellRendererComponent;
  let dialog: jest.Mocked<MatDialog>;
  let salesPlanningService: jest.Mocked<SalesPlanningService>;
  let mockDialogRef: any;

  beforeEach(() => {
    mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(5)),
    };

    component =
      Stub.getForEffect<SalesPlanningSinglePercentageEditCellRendererComponent>(
        {
          component: SalesPlanningSinglePercentageEditCellRendererComponent,
          providers: [
            Stub.getMatDialogProvider(),
            Stub.getSalesPlanningServiceProvider(),
          ],
        }
      );

    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
    salesPlanningService = TestBed.inject(
      SalesPlanningService
    ) as jest.Mocked<SalesPlanningService>;

    dialog.open = jest.fn().mockReturnValue(mockDialogRef);
    salesPlanningService.updateSalesDeductions = jest
      .fn()
      .mockReturnValue(of(0));
    salesPlanningService.updateCashDiscounts = jest.fn().mockReturnValue(of(0));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should set properties from the provided parameters for yearly row', () => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
          totalSalesPlanUnconstrained: 1000,
          salesPlanUnconstrained: 900,
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.SalesDeduction,
        context: {
          reloadData: jest.fn(),
        },
        node: {
          level: 0,
        },
      } as any;

      component.setValue(mockParams);

      expect(component['customerNumber']).toBe('12345');
      expect(component['planningYear']).toBe('2023');
      expect(component['planningCurrency']).toBe('EUR');
      expect(component['percentageValueName']).toBe('Test Percentage');
      expect(component['percentageEditOption']).toBe(
        PercentageEditOption.SalesDeduction
      );
      expect(component.isYearlyRow).toBe(true);
    });

    it('should set isYearlyRow to false for non-yearly rows', () => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.CashDiscount,
        context: { reloadData: jest.fn() },
        node: { level: 1 },
      } as any;

      component.setValue(mockParams);

      expect(component.isYearlyRow).toBe(false);
    });
  });

  describe('handleEditSinglePercentageValueClicked', () => {
    beforeEach(() => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
          totalSalesPlanUnconstrained: 1000,
          salesPlanUnconstrained: 900,
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.SalesDeduction,
        context: {
          reloadData: jest.fn(),
        },
        node: { level: 0 },
      } as any;

      component.setValue(mockParams);
      component['valueFormatted'].set('10%');
    });

    it('should open dialog with correct data', () => {
      component.handleEditSinglePercentageValueClicked();

      expect(dialog.open).toHaveBeenCalledWith(
        CustomerSalesPlanSinglePercentageEditModalComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            planningCurrency: 'EUR',
            currentValueLabel: expect.any(String),
            previousValueLabel: expect.any(String),
            previousValue: '10%',
          }),
          width: '600px',
          disableClose: true,
          autoFocus: false,
        })
      );
    });

    it('should reload data when dialog returns a value', () => {
      component.handleEditSinglePercentageValueClicked();

      expect(component['onReloadData']).toHaveBeenCalled();
    });

    it('should not reload data when dialog returns null', () => {
      mockDialogRef.afterClosed.mockReturnValue(of(null));

      component.handleEditSinglePercentageValueClicked();

      expect(component['onReloadData']).not.toHaveBeenCalled();
    });
  });

  describe('updateAdjustedPercentage', () => {
    it('should call updateSalesDeductions for SalesDeduction option', () => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.SalesDeduction,
        context: { reloadData: jest.fn() },
        node: { level: 0 },
      } as any;

      component.setValue(mockParams);

      const onSave = component['onSave']();
      onSave(15);

      expect(salesPlanningService.updateSalesDeductions).toHaveBeenCalledWith(
        '12345',
        '2023',
        15
      );
      expect(salesPlanningService.updateCashDiscounts).not.toHaveBeenCalled();
    });

    it('should call updateCashDiscounts for CashDiscount option', () => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.CashDiscount,
        context: { reloadData: jest.fn() },
        node: { level: 0 },
      } as any;

      component.setValue(mockParams);

      const onSave = component['onSave']();
      onSave(15);

      expect(salesPlanningService.updateCashDiscounts).toHaveBeenCalledWith(
        '12345',
        '2023',
        15
      );
      expect(salesPlanningService.updateSalesDeductions).not.toHaveBeenCalled();
    });

    it('should pass 0 when delete is called', () => {
      const mockParams = {
        value: 10,
        data: {
          customerNumber: '12345',
          planningYear: '2023',
          planningCurrency: 'EUR',
        },
        percentageValueName: 'Test Percentage',
        percentageEditOption: PercentageEditOption.SalesDeduction,
        context: { reloadData: jest.fn() },
        node: { level: 0 },
      } as any;

      component.setValue(mockParams);

      const onDelete = component['onDelete']();
      onDelete();

      expect(salesPlanningService.updateSalesDeductions).toHaveBeenCalledWith(
        '12345',
        '2023',
        0
      );
    });
  });
});
