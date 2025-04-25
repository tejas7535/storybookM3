import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { SalesPlanningDetailLevel } from '../../../../../../../feature/sales-planning/model';
import { Stub } from '../../../../../../../shared/test/stub.class';
import { TimeScope } from '../../../column-definition';
import { CustomerSalesPlanNumberAndPercentageEditModalComponent } from '../../../customer-sales-plan-number-and-percentage-edit-modal/customer-sales-plan-number-and-percentage-edit-modal.component';
import { SalesPlanningAdjustedTotalCellRendererComponent } from './sales-planning-adjusted-total-cell-renderer.component';

describe('SalesPlanningAdjustedTotalCellRendererComponent', () => {
  let component: SalesPlanningAdjustedTotalCellRendererComponent;
  const mockReloadData = jest.fn();

  beforeEach(() => {
    component = Stub.get({
      component: SalesPlanningAdjustedTotalCellRendererComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getSalesPlanningServiceProvider(),
        Stub.getAuthServiceProvider(),
        Stub.getNumberWithoutFractionDigitsPipeProvider(),
      ],
    });

    jest.spyOn(component['dialog'], 'open');

    const mockParams = {
      data: {
        detailLevel: SalesPlanningDetailLevel.MonthlyOnlyDetailLevel,
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: '2025',
        editStatus: '1',
      },
      context: {
        reloadData: mockReloadData,
      },
      scope: TimeScope.Monthly,
      value: 100,
    } as any;

    component.agInit(mockParams);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct edit status', () => {
    expect(component['editStatus']()).toBe('1');
  });

  it('should open the edit modal on button click', () => {
    jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue({ afterClosed: () => of(null) } as MatDialogRef<null>);
    component['handleEditCustomerSalesPlanNumberClicked']();

    expect(component['dialog'].open).toHaveBeenCalledWith(
      CustomerSalesPlanNumberAndPercentageEditModalComponent,
      expect.objectContaining({
        data: {
          currentValueLabel:
            'sales_planning.planning_details.edit_modal.adjusted_monthly_total',
          formLabel: 'sales_planning.planning_details.edit_modal.monthly_total',
          inputValidatorErrorMessage:
            'sales_planning.planning_details.edit_modal.adjusted_total_error_message',
          inputValidatorFn: expect.any(Function),
          onDelete: expect.any(Function),
          onSave: expect.any(Function),
          planningCurrency: 'EUR',
          previousValue: 100,
          previousValueLabel:
            'sales_planning.planning_details.edit_modal.previous_adjusted_monthly_total',
          title: '2025',
        },
      })
    );
  });

  it('should call deleteDetailedCustomerSalesPlan on delete', () => {
    jest
      .spyOn(
        component['salesPlanningService'],
        'deleteDetailedCustomerSalesPlan'
      )
      .mockReturnValue(of());
    const deleteFn = component['onDelete']();
    deleteFn();
    expect(
      component['salesPlanningService'].deleteDetailedCustomerSalesPlan
    ).toHaveBeenCalled();
  });

  it('should call updateDetailedCustomerSalesPlan on save', () => {
    jest
      .spyOn(
        component['salesPlanningService'],
        'updateDetailedCustomerSalesPlan'
      )
      .mockReturnValue(of());
    const saveFn = component['onSave']();

    saveFn(15_000);

    expect(
      component['salesPlanningService'].updateDetailedCustomerSalesPlan
    ).toHaveBeenCalledWith('93090', {
      adjustedValue: 15_000,
      planningCurrency: 'EUR',
      planningLevelMaterialType: 'PL',
      planningMaterial: 'I03',
      planningMonth: undefined,
      planningYear: '2025',
    });
  });

  it('editing should not be possible on planning material level for current year > year + 2', () => {
    const mockParams = {
      data: {
        detailLevel:
          SalesPlanningDetailLevel.MonthlyAndPlanningLevelMaterialDetailLevel,
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: new Date().getFullYear() + 3,
      },
      context: {
        reloadData: mockReloadData,
      },
    } as any;

    component.agInit(mockParams);

    expect(component.isEditPossible()).toBe(false);
  });

  it('should trigger reload data when dialog returns a value', () => {
    jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue({ afterClosed: () => of(7500) } as MatDialogRef<number>);
    component.handleEditCustomerSalesPlanNumberClicked();

    expect(mockReloadData).toHaveBeenCalled();
  });

  it('editing should be possible on year level for year > year + 2', () => {
    const mockParams = {
      data: {
        detailLevel:
          SalesPlanningDetailLevel.YearlyAndPlanningLevelMaterialDetailLevel,
        customerNumber: '93090',
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningLevelMaterialType: 'PL',
        planningCurrency: 'EUR',
        planningYear: new Date().getFullYear() + 3,
      },
      context: {
        reloadData: mockReloadData,
      },
    } as any;

    component.agInit(mockParams);

    expect(component.isEditPossible()).toBe(true);
  });
});
