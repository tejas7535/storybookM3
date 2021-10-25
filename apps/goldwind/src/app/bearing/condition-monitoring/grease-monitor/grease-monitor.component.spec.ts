import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DISPLAY } from '../../../../testing/mocks';
import { SensorModule } from '../../../shared/sensor/sensor.module';
import { GreaseMonitorComponent } from './grease-monitor.component';

describe('GreaseStatusComponent', () => {
  let component: GreaseMonitorComponent;
  let spectator: Spectator<GreaseMonitorComponent>;

  const createComponent = createComponentFactory({
    component: GreaseMonitorComponent,
    detectChanges: false,
    imports: [
      RouterTestingModule,
      SensorModule,
      MatCardModule,
      MatIconModule,
      NgxEchartsModule.forRoot({
        echarts: async () =>
          /* istanbul ignore next */
          import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          greaseStatus: {
            loading: false,
            result: undefined,
            status: {
              loading: false,
              result: undefined,
            },
            display: DISPLAY,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
        },
      }),
    ],
    declarations: [GreaseMonitorComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should run successfully through getGreaseStatusLatestGraphData', () => {
    component.getGreaseStatusLatestGraphData({ sensor: true });

    expect(component.getGreaseStatusLatestWaterContentGraphData$).toBeDefined();
  });
});
