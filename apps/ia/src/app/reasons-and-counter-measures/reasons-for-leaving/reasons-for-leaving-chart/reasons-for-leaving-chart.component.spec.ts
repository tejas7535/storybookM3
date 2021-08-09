import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';

import { SolidDoughnutChartComponent } from '../../../shared/charts/solid-doughnut-chart/solid-doughnut-chart.component';
import { ReasonsForLeavingChartComponent } from './reasons-for-leaving-chart.component';

describe('ReasonsForLeavingChartComponent', () => {
  let component: ReasonsForLeavingChartComponent;
  let spectator: Spectator<ReasonsForLeavingChartComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingChartComponent,
    detectChanges: false,
    declarations: [MockComponent(SolidDoughnutChartComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
