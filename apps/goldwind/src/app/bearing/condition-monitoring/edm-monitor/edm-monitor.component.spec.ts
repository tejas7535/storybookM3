import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { setEdmInterval } from '../../../core/store/actions/edm-monitor/edm-monitor.actions';
import { AntennaName } from '../../../core/store/reducers/edm-monitor/models';
import { DateRangeModule } from '../../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { EdmMonitorComponent } from './edm-monitor.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('EdmMonitorComponent', () => {
  let component: EdmMonitorComponent;
  let spectator: Spectator<EdmMonitorComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: EdmMonitorComponent,
    imports: [
      DateRangeModule,
      EmptyGraphModule,
      MatCardModule,
      MatSlideToggleModule,
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

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
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

  describe('setEdmInterval', () => {
    test('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setEdmInterval({ interval: mockInterval })
      );
    });
  });

  describe('chartOptions', () => {
    it('should call legend formatter method', () => {
      const mockLabelName = 'edmValue1CounterMax';
      component.formatLegend = jest.fn();

      const legendFormatter = component.chartOptions.legend
        .formatter as Function;
      legendFormatter(mockLabelName);

      expect(component.formatLegend).toHaveBeenCalledTimes(1);
    });

    it('should call tooltip formatter method', () => {
      const mockParams = [
        {
          seriesName: 'edmValue1CounterMax',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      component.formatTooltip = jest.fn();

      const tooltipFormatter = component.chartOptions.tooltip
        .formatter as Function;
      tooltipFormatter(mockParams);

      expect(component.formatTooltip).toHaveBeenCalledTimes(1);
    });

    describe('formatLegend', () => {
      it('should return a translated text with physical symbold ', () => {
        const mockLabelName = 'edmValue1CounterMax';
        const formattedMockLabel = 'translate it (translate it 1)';

        expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);

        const mockLabelName2 = 'edmValue2Counter';
        const formattedMockLabel2 = 'translate it (translate it 2)';

        expect(component.formatLegend(mockLabelName2)).toBe(
          formattedMockLabel2
        );
      });
    });

    describe('formatTooltip', () => {
      it('should return a translated texts, antenna number and date', () => {
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
        const mockParams = [
          {
            seriesName: 'edmValue1CounterMax',
            data: {
              value: [new Date(), 123],
            },
          },
        ];
        const formattedMockTooltip = `translate it (translate it 1): 123<br>${mockDate.toLocaleString()}`;

        expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
      });
    });

    describe('getAntennaLabel', () => {
      it('should return a translated antenna text and number', () => {
        const mockAntennaName = 'edmValue1CounterMax';
        const formattedMockAntennaName = 'translate it 1';

        expect(component.getAntennaLabel(mockAntennaName)).toBe(
          formattedMockAntennaName
        );
      });
    });
  });
});
