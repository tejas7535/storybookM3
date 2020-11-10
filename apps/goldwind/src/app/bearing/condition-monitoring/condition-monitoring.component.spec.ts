import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { CenterLoadModule } from './center-load/center-load.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorModule } from './grease-monitor/grease-monitor.module';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let spectator: Spectator<ConditionMonitoringComponent>;

  const createComponent = createComponentFactory({
    component: ConditionMonitoringComponent,
    imports: [
      RouterTestingModule,
      UnderConstructionModule,
      LoadingSpinnerModule,
      EdmMonitorModule,
      GreaseMonitorModule,
      CenterLoadModule,
      MatCardModule,
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
              startDate: 123456789,
              endDate: 987654321,
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
