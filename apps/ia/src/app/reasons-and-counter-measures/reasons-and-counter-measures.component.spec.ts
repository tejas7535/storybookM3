import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { SolidDoughnutChartComponent } from '../shared/charts/solid-doughnut-chart/solid-doughnut-chart.component';
import { SharedModule } from '../shared/shared.module';
import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';
import { ReasonsForLeavingTableModule } from './reasons-for-leaving/reasons-for-leaving-table/reasons-for-leaving-table.module';

describe('ReasonsAndCounterMeasuresComponent', () => {
  let component: ReasonsAndCounterMeasuresComponent;
  let spectator: Spectator<ReasonsAndCounterMeasuresComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsAndCounterMeasuresComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedModule,
      MatCardModule,
      SharedTranslocoModule,
      ReasonsForLeavingTableModule,
    ],
    providers: [provideMockStore({})],
    declarations: [MockComponent(SolidDoughnutChartComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('ReasonsAndCounterMeasuresComponent', () => {
    test('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
