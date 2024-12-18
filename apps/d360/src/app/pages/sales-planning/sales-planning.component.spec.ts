import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { CustomerSelectionComponent } from './components/customer-selection/customer-selection.component';
import { SalesPlanningComponent } from './sales-planning.component';

describe('SalesPlanningComponent', () => {
  let spectator: Spectator<SalesPlanningComponent>;

  const createComponent = createComponentFactory({
    component: SalesPlanningComponent,
    componentMocks: [],
    imports: [MockComponent(CustomerSelectionComponent)],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
