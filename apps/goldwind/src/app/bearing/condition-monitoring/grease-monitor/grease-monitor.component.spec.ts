import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DISPLAY } from '../../../../testing/mocks';
import { DashboardMoreInfoDialogComponent } from '../../../shared/dashboard-more-info-dialog/dashboard-more-info-dialog.component';
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
      MatIconTestingModule,
      MatDialogModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [GreaseMonitorComponent, DashboardMoreInfoDialogComponent],
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
