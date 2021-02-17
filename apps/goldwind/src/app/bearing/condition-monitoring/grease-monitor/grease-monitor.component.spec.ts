import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
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
  let router: Router;

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
              deterioration: true,
              waterContent: true,
              temperatureOptics: true,

              // rotationalSpeed: false,
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
    router = spectator.inject(Router);
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Details Button', () => {
    test('should navigate', () => {
      spyOn(router, 'navigate');
      component.navigateToGreaseStatus();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
