import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { DATE_FORMAT } from '../../../shared/constants';
import { DateRangeModule } from '../../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { SensorModule } from '../../../shared/sensor/sensor.module';
import { EdmMonitorComponent } from './edm-monitor.component';

describe('EdmMonitorComponent', () => {
  let component: EdmMonitorComponent;
  let spectator: Spectator<EdmMonitorComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: EdmMonitorComponent,
    imports: [
      DateRangeModule,
      EmptyGraphModule,
      SensorModule,
      MatCardModule,
      MatIconModule,
      MatIconTestingModule,
      RouterTestingModule,
      MatSlideToggleModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [EdmMonitorComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
    component.ngOnInit();
  });
  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setEdmInterval', () => {
    it('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setEdmInterval({ interval: mockInterval })
      );
    });
  });

  describe('chartOptions', () => {
    describe('formatLegend', () => {
      it('should return a translated text with physical symbol', () => {
        const mockLabelName = 'edmValue1CounterMax';
        const formattedMockLabel =
          'conditionMonitoring.edmMonitor.peakValues (sensor.antenna 1)';

        expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);

        const mockLabelName2 = 'edmValue2Counter';
        const formattedMockLabel2 =
          'conditionMonitoring.edmMonitor.relativeAmountOfEvents (sensor.antenna 2)';

        expect(component.formatLegend(mockLabelName2)).toBe(
          formattedMockLabel2
        );
      });
    });

    describe('formatTooltip', () => {
      it('should return a translated texts, antenna number and date', () => {
        const mockDate = new Date(1_466_424_490_000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
        const mockParams = [
          {
            seriesName: 'edmValue1CounterMax',
            data: {
              value: [new Date(), 123],
            },
          },
        ];
        const formattedMockTooltip = `conditionMonitoring.edmMonitor.peakValues (sensor.antenna 1): 123<br>${mockDate.toLocaleString(
          DATE_FORMAT.local,
          DATE_FORMAT.options
        )}`;

        expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
      });
    });

    describe('getAntennaLabel', () => {
      it('should return a translated antenna text and number', () => {
        const mockAntennaName = 'edmValue1CounterMax';
        const formattedMockAntennaName = 'sensor.antenna 1';

        expect(component.getAntennaLabel(mockAntennaName)).toBe(
          formattedMockAntennaName
        );
      });
    });

    describe('getClassificationString', () => {
      it('should return a string matching the class description', () => {
        expect(component.getClassificationString(0)).toBe('0 - 10');
        expect(component.getClassificationString(1)).toBe('10 - 100');
        expect(component.getClassificationString(2)).toBe('100 - 1000');
        expect(component.getClassificationString(3)).toBe('1000 - 10000');
        expect(component.getClassificationString(4)).toBe('> 10000');
        expect(component.getClassificationString(-1)).toBe('n.A.');
      });
    });
  });
});
