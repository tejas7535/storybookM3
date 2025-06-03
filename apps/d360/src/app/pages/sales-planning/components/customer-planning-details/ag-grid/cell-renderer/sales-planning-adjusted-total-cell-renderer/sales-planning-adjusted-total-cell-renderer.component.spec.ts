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
      node: { level: 0 },
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
    component['planningMonth'] = '01';
    jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue({ afterClosed: () => of(null) } as MatDialogRef<null>);
    component['handleEditCustomerSalesPlanNumberClicked']();

    expect(component['dialog'].open).toHaveBeenCalledWith(
      CustomerSalesPlanNumberAndPercentageEditModalComponent,
      {
        autoFocus: false,
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
          title: '2025 sales_planning.table.months.01',
        },
        disableClose: true,
        width: '600px',
      }
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
      node: { level: 0 },
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
      node: { level: 0 },
    } as any;

    component.agInit(mockParams);

    expect(component.isEditPossible()).toBe(true);
  });

  describe('getTitle', () => {
    it('should return the correct title for the edit modal when scope is monthly and isPlanningMaterialRow is true', () => {
      component['planningYear'] = '2025';
      component['planningMonth'] = '01';
      component['planningMaterial'] = 'I03';
      component['planningMaterialText'] = 'Bearings';
      component['isPlanningMaterialRow'] = true;
      component['scope'] = TimeScope.Monthly;

      jest
        .spyOn(component as any, 'getPlanningMaterialText')
        .mockReturnValue('I03 - Bearings');

      const title = (component as any).getTitle();

      expect(title).toBe('2025 sales_planning.table.months.01 I03 - Bearings');
    });

    it('should return the correct title for the edit modal when scope is yearly and isPlanningMaterialRow is false', () => {
      component['planningYear'] = '2025';
      component['isPlanningMaterialRow'] = false;
      component['scope'] = TimeScope.Yearly;

      const title = (component as any).getTitle();

      expect(title).toBe('2025');
    });

    it('should return the correct title for the edit modal when scope is monthly and isPlanningMaterialRow is false', () => {
      component['planningYear'] = '2025';
      component['planningMonth'] = '01';
      component['isPlanningMaterialRow'] = false;
      component['scope'] = TimeScope.Monthly;

      const title = (component as any).getTitle();

      expect(title).toBe('2025 sales_planning.table.months.01');
    });

    it('should return the correct title for the edit modal when scope is yearly and isPlanningMaterialRow is true', () => {
      component['planningYear'] = '2025';
      component['planningMaterial'] = 'I03';
      component['planningMaterialText'] = 'Bearings';
      component['isPlanningMaterialRow'] = true;
      component['scope'] = TimeScope.Yearly;

      jest
        .spyOn(component as any, 'getPlanningMaterialText')
        .mockReturnValue('I03 - Bearings');

      const title = (component as any).getTitle();

      expect(title).toBe('2025 I03 - Bearings');
    });
  });

  describe('validateEnteredAdjustedYearlyTotal', () => {
    it('should return null when adjustedYearlyTotal is null', () => {
      const result = (component as any).validateEnteredAdjustedYearlyTotal(
        null
      );
      expect(result).toBeNull();
    });

    it('should return null when adjustedYearlyTotal is greater than or equal to minValidationValue', () => {
      (component as any).minValidationValue = 1000;
      const result = (component as any).validateEnteredAdjustedYearlyTotal(
        1000
      );
      expect(result).toBeNull();
    });

    it('should return validation error when adjustedYearlyTotal is less than minValidationValue', () => {
      (component as any).minValidationValue = 1000;
      const result = (component as any).validateEnteredAdjustedYearlyTotal(999);
      expect(result).toEqual({ invalid: true });
    });

    it('should handle rounded values correctly', () => {
      (component as any).minValidationValue = 1000.49;
      const result = (component as any).validateEnteredAdjustedYearlyTotal(
        1000
      );
      expect(result).toBeNull();
    });
  });

  describe('getPlanningMaterialText', () => {
    it('should return the correct format for planning material text', () => {
      component['planningMaterial'] = 'ABC123';
      component['planningMaterialText'] = 'Test Material';

      const result = (component as any).getPlanningMaterialText();
      expect(result).toBe('ABC123 - Test Material');
    });
  });

  describe('isEditPossible', () => {
    it('should return true when current year + 2 >= data year and isPlanningMaterialRow is true', () => {
      const currentYear = new Date().getFullYear();
      component['planningYear'] = (currentYear + 2).toString();
      component['isPlanningMaterialRow'] = true;

      expect(component.isEditPossible()).toBe(true);
    });

    it('should return false when current year + 2 < data year and isPlanningMaterialRow is true', () => {
      const currentYear = new Date().getFullYear();
      component['planningYear'] = (currentYear + 3).toString();
      component['isPlanningMaterialRow'] = true;

      expect(component.isEditPossible()).toBe(false);
    });

    it('should always return true when isPlanningMaterialRow is false regardless of year', () => {
      const currentYear = new Date().getFullYear();
      component['planningYear'] = (currentYear + 5).toString();
      component['isPlanningMaterialRow'] = false;

      expect(component.isEditPossible()).toBe(true);
    });
  });

  describe('setValue', () => {
    it('should set isPlanningMaterialRow to true when node level is 1', () => {
      const mockParams = {
        data: {
          detailLevel: SalesPlanningDetailLevel.MonthlyOnlyDetailLevel,
          customerNumber: '93090',
          planningMaterial: 'I03',
          planningMaterialText: 'Bearings',
          planningLevelMaterialType: 'PL',
          planningCurrency: 'EUR',
          planningYear: '2025',
          planningMonth: '01',
          firmBusiness: 100,
          firmBusinessServices: 200,
          openPlannedValueDemand360: 300,
          opportunitiesDemandRelevant: 400,
          opportunitiesForecastRelevant: 500,
        },
        context: {
          reloadData: mockReloadData,
        },
        scope: TimeScope.Monthly,
        value: 2000,
        node: { level: 1 },
      } as any;

      component.agInit(mockParams);
      expect(component['isPlanningMaterialRow']).toBe(true);
    });

    it('should set isPlanningMaterialRow to true when detailLevel is MonthlyAndPlanningLevelMaterialDetailLevel', () => {
      const mockParams = {
        data: {
          detailLevel:
            SalesPlanningDetailLevel.MonthlyAndPlanningLevelMaterialDetailLevel,
          customerNumber: '93090',
          planningMaterial: 'I03',
          planningMaterialText: 'Bearings',
          planningLevelMaterialType: 'PL',
          planningCurrency: 'EUR',
          planningYear: '2025',
          planningMonth: '01',
          firmBusiness: 100,
          firmBusinessServices: 200,
          openPlannedValueDemand360: 300,
          opportunitiesDemandRelevant: 400,
          opportunitiesForecastRelevant: 500,
        },
        context: {
          reloadData: mockReloadData,
        },
        scope: TimeScope.Monthly,
        value: 2000,
        node: { level: 0 },
      } as any;

      component.agInit(mockParams);
      expect(component['isPlanningMaterialRow']).toBe(true);
    });

    it('should calculate minValidationValue correctly', () => {
      const mockParams = {
        data: {
          detailLevel: SalesPlanningDetailLevel.MonthlyOnlyDetailLevel,
          customerNumber: '93090',
          planningMaterial: 'I03',
          planningMaterialText: 'Bearings',
          planningLevelMaterialType: 'PL',
          planningCurrency: 'EUR',
          planningYear: '2025',
          planningMonth: '01',
          firmBusiness: 100,
          firmBusinessServices: 200,
          openPlannedValueDemand360: 300,
          opportunitiesDemandRelevant: 400,
          opportunitiesForecastRelevant: 500,
        },
        context: {
          reloadData: mockReloadData,
        },
        scope: TimeScope.Monthly,
        value: 2000,
        node: { level: 0 },
      } as any;

      component.agInit(mockParams);
      expect(component['minValidationValue']).toBe(1500); // Sum of all business values
    });
  });
});
