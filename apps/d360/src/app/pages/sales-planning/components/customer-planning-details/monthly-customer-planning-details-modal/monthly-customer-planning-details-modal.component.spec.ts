import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal.component';
import { MonthlyCustomerPlanningDetailsColumnSettingsService } from './service/monthly-customer-planning-details-column-settings.service';

describe('MonthlyCustomerPlanningDetailsModalComponent', () => {
  let spectator: Spectator<MonthlyCustomerPlanningDetailsModalComponent>;
  let component: MonthlyCustomerPlanningDetailsModalComponent;
  let salesPlanningService: SalesPlanningService;

  const createComponent = createComponentFactory({
    component: MonthlyCustomerPlanningDetailsModalComponent,
    providers: [
      mockProvider(MatDialogRef),
      mockProvider(MonthlyCustomerPlanningDetailsColumnSettingsService),
      mockProvider(NumberWithoutFractionDigitsPipe),
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
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
        },
      },
      {
        provide: SalesPlanningService,
        useValue: {
          getDetailedCustomerSalesPlan: jest.fn().mockReturnValue(of([])),
        },
      },
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    salesPlanningService = spectator.inject(SalesPlanningService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loading state and fetch data', () => {
    const spy = jest.spyOn(
      salesPlanningService,
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
    const dialogRef = spectator.inject(MatDialogRef);
    const spy = jest.spyOn(dialogRef, 'close');
    component.onClose();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
