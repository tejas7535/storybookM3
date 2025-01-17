import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { CustomerPlanningDetailsComponent } from './components/customer-planning-details/customer-planning-details.component';
import { CustomerSalesPlanChartComponent } from './components/customer-sales-plan-chart/customer-sales-plan-chart.component';
import { CustomerSelectionComponent } from './components/customer-selection/customer-selection.component';
import { SalesPlanningComponent } from './sales-planning.component';

describe('SalesPlanningComponent', () => {
  let spectator: Spectator<SalesPlanningComponent>;

  const createComponent = createComponentFactory({
    component: SalesPlanningComponent,
    componentMocks: [],
    imports: [
      MockComponent(CustomerSelectionComponent),
      MockComponent(CustomerSalesPlanChartComponent),
      MockComponent(CustomerPlanningDetailsComponent),
    ],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
