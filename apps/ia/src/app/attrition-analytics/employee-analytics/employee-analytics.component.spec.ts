import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';

import { BarChartComponent } from '../../shared/charts/bar-chart/bar-chart.component';
import { EmployeeAnalyticsComponent } from './employee-analytics.component';

describe('EmployeeAnalyticsComponent', () => {
  let component: EmployeeAnalyticsComponent;
  let spectator: Spectator<EmployeeAnalyticsComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeAnalyticsComponent,
    imports: [MatIconModule],
    declarations: [MockComponent(BarChartComponent)],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
