import { Stub } from '../../../../shared/test/stub.class';
import { CustomerSalesPlanChartComponent } from './customer-sales-plan-chart.component';

describe('CustomerSalesPlanChartComponent', () => {
  const component: CustomerSalesPlanChartComponent = Stub.get({
    component: CustomerSalesPlanChartComponent,
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
