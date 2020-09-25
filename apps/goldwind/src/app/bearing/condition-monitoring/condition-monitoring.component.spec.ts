import { MatCardModule } from '@angular/material/card';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { CenterLoadComponent } from './center-load/center-load.component';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorComponent } from './grease-monitor/grease-monitor.component';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let spectator: Spectator<ConditionMonitoringComponent>;

  const createComponent = createComponentFactory({
    component: ConditionMonitoringComponent,
    imports: [
      UnderConstructionModule,
      LoadingSpinnerModule,
      EdmMonitorModule,
      MatCardModule,
      AgGridModule.withComponents([]),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
          },
          conditionMonitoring: {
            centerLoad: {
              socketStatus: undefined,
              events: [],
              contents: undefined,
            },
          },
          edmMonitor: {
            loading: false,
            measurements: undefined,
            interval: {
              startDate: 123456789,
              endDate: 987654321,
            },
          },
          greaseStatus: {
            loading: false,
            result: undefined,
          },
        },
      }),
    ],
    declarations: [
      ConditionMonitoringComponent,
      CenterLoadComponent,
      CmEquipmentComponent,
      GreaseMonitorComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
