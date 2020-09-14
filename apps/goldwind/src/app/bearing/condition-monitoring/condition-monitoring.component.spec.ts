import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CenterLoadComponent } from './center-load/center-load.component';
import { CmEquipmentComponent } from './cm-equipment/cm-equipment.component';
import { ConditionMonitoringComponent } from './condition-monitoring.component';
import { EdmMonitorModule } from './edm-monitor/edm-monitor.module';
import { GreaseMonitorComponent } from './grease-monitor/grease-monitor.component';

describe('ConditionMonitoringComponent', () => {
  let component: ConditionMonitoringComponent;
  let fixture: ComponentFixture<ConditionMonitoringComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        EdmMonitorModule,
        MatCardModule,
        provideTranslocoTestingModule({}),
        AgGridModule.withComponents([]),
        ReactiveComponentModule,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
