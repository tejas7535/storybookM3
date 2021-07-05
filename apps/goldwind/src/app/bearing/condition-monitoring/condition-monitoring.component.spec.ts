import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { CenterLoadModule } from './center-load/center-load.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorModule } from './grease-monitor/grease-monitor.module';
import { ShaftModule } from './shaft/shaft.module';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let spectator: Spectator<ConditionMonitoringComponent>;

  const createComponent = createComponentFactory({
    component: ConditionMonitoringComponent,
    imports: [
      RouterTestingModule,
      EdmMonitorModule,
      GreaseMonitorModule,
      CenterLoadModule,
      ShaftModule,
      MatCardModule,
      MatTabsModule,
      MatIconModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
          },
          loadSense: {
            loading: false,
            result: undefined,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
          edmMonitor: {
            loading: false,
            measurements: undefined,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
          greaseStatus: {
            loading: false,
            result: undefined,
            status: {
              loading: false,
              result: undefined,
            },
          },
        },
      }),
    ],
    declarations: [ConditionMonitoringComponent, CmEquipmentComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
