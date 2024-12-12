import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { CurrencyService } from '../../../info/currency.service';
import { ChartSettingsService } from '../../forecast-chart.service';
import { ForecastChartComponent } from './forecast-chart.component';

describe('ForecastChartComponent', () => {
  let spectator: Spectator<ForecastChartComponent>;
  const createComponent = createComponentFactory({
    component: ForecastChartComponent,
    imports: [],
    providers: [
      mockProvider(CurrencyService),
      mockProvider(HttpClient, { get: () => of({}) }),
      mockProvider(ChartSettingsService, {
        getChartSettings: jest.fn().mockReturnValue(of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        globalSelectionState: null,
        columnFilters: [],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
