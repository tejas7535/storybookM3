import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ForecastChartComponent } from '../../../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { CustomerSalesPlanChartComponent } from './customer-sales-plan-chart.component';

describe('CustomerSalesPlanChartComponent', () => {
  let spectator: Spectator<CustomerSalesPlanChartComponent>;

  const createComponent = createComponentFactory({
    component: CustomerSalesPlanChartComponent,
    imports: [ForecastChartComponent],
  });

  it('should create the component', () => {
    spectator = createComponent({
      props: {
        customerName: 'ABC Corp',
        customerNumber: '12345',
        planningCurrency: 'USD',
      },
    });

    expect(spectator.component).toBeTruthy();
  });
});
