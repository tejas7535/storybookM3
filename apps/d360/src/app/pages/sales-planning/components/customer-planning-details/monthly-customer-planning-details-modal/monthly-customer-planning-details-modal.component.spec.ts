import { Stub } from '../../../../../shared/test/stub.class';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal.component';

describe('MonthlyCustomerPlanningDetailsModalComponent', () => {
  let component: MonthlyCustomerPlanningDetailsModalComponent;

  beforeEach(() => {
    component = Stub.get<MonthlyCustomerPlanningDetailsModalComponent>({
      component: MonthlyCustomerPlanningDetailsModalComponent,
      providers: [
        Stub.getMonthlyCustomerPlanningDetailsColumnSettingsServiceProvider(),
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
        Stub.getSalesPlanningServiceProvider(),
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
    component.fetchData();
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
