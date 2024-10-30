import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ForecastChartLegendComponent } from './forecast-chart-legend.component';

describe('ForecastChartLegendComponent', () => {
  let spectator: Spectator<ForecastChartLegendComponent>;
  const createComponent = createComponentFactory({
    component: ForecastChartLegendComponent,
  });

  beforeEach(() => {
    spectator = createComponent({});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
