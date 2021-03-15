import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { SensorModule } from '../../../shared/sensor/sensor.module';
import { GreaseMonitorComponent } from './grease-monitor.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

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
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
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
            display: {
              deterioration_1: true,
              waterContent_1: true,
              temperatureOptics_1: true,
              deterioration_2: true,
              waterContent_2: true,
              temperatureOptics_2: true,
              rsmShaftSpeed: true,
            },
            interval: {
              startDate: 123456789,
              endDate: 987654321,
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
});
