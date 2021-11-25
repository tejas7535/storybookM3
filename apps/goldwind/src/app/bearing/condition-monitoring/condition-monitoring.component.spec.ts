import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadDistributionCardModule } from './load-distribution-card/load-distribution-card.module';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorModule } from './grease-monitor/grease-monitor.module';
import { ShaftModule } from './shaft/shaft.module';
import { StaticSafteyFactorMonitorModule } from './static-saftey-factor-monitor/static-saftey-factor-monitor.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let spectator: Spectator<ConditionMonitoringComponent>;

  const createComponent = createComponentFactory({
    component: ConditionMonitoringComponent,
    imports: [
      RouterTestingModule,
      EdmMonitorModule,
      GreaseMonitorModule,
      LoadDistributionCardModule,
      StaticSafteyFactorMonitorModule,
      ShaftModule,
      MatCardModule,
      MatTabsModule,
      MatIconModule,
      MatIconTestingModule,
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
          staticSafety: {
            loading: false,
            result: undefined,
            status: {
              loading: false,
              result: undefined,
            },
          },
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
