import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { ForecastChartComponent } from '../../feature/forecast-chart/components/forecast-chart/forecast-chart.component';
import { CurrencyService } from '../../feature/info/currency.service';
import { GlobalSelectionCriteriaComponent } from '../../shared/components/global-selection-criteria/global-selection-criteria/global-selection-criteria.component';
import { HomeComponent } from './home.component';
import { MaterialCustomerTableComponent } from './table/components/material-customer-table/material-customer-table.component';

describe('HomeComponent', () => {
  let spectator: Spectator<HomeComponent>;
  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      MockComponent(GlobalSelectionCriteriaComponent),
      MockComponent(ForecastChartComponent),
      MockComponent(MaterialCustomerTableComponent),
    ],
    providers: [
      mockProvider(CurrencyService, {
        getCurrentCurrency: jest.fn().mockReturnValue(of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
