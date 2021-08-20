import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { EmployeeAnalyticsComponent } from './employee-analytics.component';

describe('EmployeeAnalyticsComponent', () => {
  let component: EmployeeAnalyticsComponent;
  let spectator: Spectator<EmployeeAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeAnalyticsComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
