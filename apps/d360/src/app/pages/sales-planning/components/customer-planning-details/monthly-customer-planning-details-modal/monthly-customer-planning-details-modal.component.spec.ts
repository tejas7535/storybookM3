import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { Stub } from '../../../../../shared/test/stub.class';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal.component';
import { MonthlyCustomerPlanningDetailsColumnSettingsService } from './service/monthly-customer-planning-details-column-settings.service';

describe('MonthlyCustomerPlanningDetailsModalComponent', () => {
  let component: MonthlyCustomerPlanningDetailsModalComponent;

  beforeEach(() => {
    component = Stub.get<MonthlyCustomerPlanningDetailsModalComponent>({
      component: MonthlyCustomerPlanningDetailsModalComponent,
      providers: [
        MockProvider(MonthlyCustomerPlanningDetailsColumnSettingsService),
        MockProvider(NumberWithoutFractionDigitsPipe),
        MockProvider(MAT_DIALOG_DATA, {
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
        MockProvider(
          SalesPlanningService,
          { getDetailedCustomerSalesPlan: jest.fn().mockReturnValue(of([])) },
          'useValue'
        ),
      ],
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loading state and fetch data', () => {
    const spy = jest.spyOn(
      component['salesPlanningService'],
      'getDetailedCustomerSalesPlan'
    );
    component.ngOnInit();
    expect(component.isLoading()).toBeFalsy();
    expect(spy).toHaveBeenCalledWith({
      customerNumber: '12345',
      detailLevel: '3',
      planningCurrency: 'USD',
      planningLevelMaterialType: 'PL',
      planningMaterial: '3',
      planningYear: '2025',
    });
  });

  it('should close the dialog when onClose is called', () => {
    const spy = jest.spyOn(component['dialogRef'], 'close');
    component.onClose();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
