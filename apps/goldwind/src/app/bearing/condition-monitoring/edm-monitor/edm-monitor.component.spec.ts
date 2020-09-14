import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { setInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { AntennaName } from '../../../core/store/reducers/edm-monitor/models';
import { DateRangeModule } from '../../../shared/date-range/date-range.module';
import { EdmMonitorComponent } from './edm-monitor.component';

describe('EdmMonitorComponent', () => {
  let component: EdmMonitorComponent;
  let fixture: ComponentFixture<EdmMonitorComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        DateRangeModule,
        MatCardModule,
        MatSlideToggleModule,
        provideTranslocoTestingModule({}),
        ReactiveComponentModule,
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
      ],
      providers: [
        provideMockStore({
          initialState: {
            edmMonitor: {
              loading: false,
              measurements: undefined,
              interval: {
                startDate: 123456789,
                endDate: 987654321,
              },
            },
          },
        }),
      ],
      declarations: [EdmMonitorComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdmMonitorComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleAntenna', () => {
    test('should toggle the antenna and call getEdmGraphData', () => {
      component.getEdmGraphData = jest.fn();

      component.antenna = true;

      component.toggleAntenna();
      expect(component.antenna).toBe(false);

      expect(component.getEdmGraphData).toHaveBeenCalledTimes(1);
      expect(component.getEdmGraphData).toHaveBeenCalledWith({
        antennaName: AntennaName.Antenna1,
      });
    });
  });

  describe('setInterval', () => {
    test('should dispatch the setInterval action', () => {
      store.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      component.setInterval(mockInterval);

      expect(store.dispatch).toHaveBeenCalledWith(
        setInterval({ interval: mockInterval })
      );
    });
  });
});
