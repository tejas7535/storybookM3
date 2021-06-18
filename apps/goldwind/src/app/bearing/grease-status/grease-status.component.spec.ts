import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { BearingMetadata } from '../../core/store/reducers/bearing/models';
import { DATE_FORMAT } from '../../shared/constants';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { CenterLoadModule } from '../condition-monitoring/center-load/center-load.module';
import { GreaseStatusComponent } from './grease-status.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('GreaseStatusComponent', () => {
  let component: GreaseStatusComponent;
  let spectator: Spectator<GreaseStatusComponent>;
  let mockStore: MockStore;

  const bearingMetaData: BearingMetadata = {
    id: 'bbc9a782-f0fc-4a5a-976e-b28cfe187b19',
    name: 'Windturbine of qa-009',
    type: 'WT_QA_009',
    description:
      'Windturbing with qa-009 connected. Used for generating mock data',
    manufacturer: 'Schaeffler',
    locationLatitude: 49.563_106_5,
    locationLongitude: 10.884_736_2,
    edgeDevice: {
      description: 'Edge device test desc',
      id: 'id-edge-device',
      manufacturer: 'Schaeffler',
      name: 'edge-device-test',
      serialNumber: '234',
      type: 'test',
    },
    windFarm: {
      id: 'test-windfarm',
      country: 'Test',
      description: 'Test Windfarm',
      locationLatitude: 0.22,
      locationLongitude: 2.33,
      name: 'Windfarm Test',
      owner: 'Goldwind',
    },
  };

  const createComponent = createComponentFactory({
    component: GreaseStatusComponent,
    imports: [
      ReactiveFormsModule,
      DateRangeModule,
      EmptyGraphModule,
      CenterLoadModule,

      // Material Modules
      MatCardModule,
      MatCheckboxModule,
      MatTreeModule,
      MatIconModule,

      // ECharts
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
            display: {
              waterContent_1: true,
              deterioration_1: true,
              temperatureOptics_1: true,
              waterContent_2: true,
              deterioration_2: true,
              temperatureOptics_2: true,
              rsmShaftSpeed: true,
            },
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
          shaft: {
            loading: false,
            result: undefined,
            status: {
              result: undefined,
              loading: false,
            },
          },
          bearing: {
            loading: false,
            result: bearingMetaData,
          },
        },
      }),
    ],
    declarations: [GreaseStatusComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display Form', () => {
    it('should dispatch setGreaseAction on valueChanges', () => {
      const mockGreaseDisplay = {
        waterContent_1: true,
        deterioration_1: true,
        temperatureOptics_1: true,
        waterContent_2: true,
        deterioration_2: true,
        temperatureOptics_2: true,
        rsmShaftSpeed: true,
      };

      mockStore.dispatch = jest.fn();

      component.displayForm.markAsDirty();
      component.displayForm.patchValue({ rotationalSpeed: false });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setGreaseDisplay({ greaseDisplay: mockGreaseDisplay })
      );
    });
  });

  describe('setGreaseInterval', () => {
    it('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setGreaseInterval({ interval: mockInterval })
      );
    });
  });

  describe('chartOptions', () => {
    it('should call legend formatter method', () => {
      const mockLabelName = 'waterContent_1';
      component.formatLegend = jest.fn();

      const legendFormatter = (component.chartOptions.legend as any)
        .formatter as Function;
      legendFormatter(mockLabelName);

      expect(component.formatLegend).toHaveBeenCalledTimes(1);
    });

    it('should call tooltip formatter method', () => {
      const mockParams = [
        {
          seriesName: 'waterContent_1',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      component.formatTooltip = jest.fn();

      const tooltipFormatter = (component.chartOptions.tooltip as any)
        .formatter as Function;
      tooltipFormatter(mockParams);

      expect(component.formatTooltip).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatLegend', () => {
    it('should return a translated text with physical symbol', () => {
      const mockLabelName = 'waterContent_1';
      const formattedMockLabel = 'translate it (%)';

      expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);
    });
  });

  describe('formatTooltip', () => {
    it('should return a translated texts with physical symbols and date', () => {
      const mockDate = new Date(1_466_424_490_000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      const mockParams = [
        {
          seriesName: 'waterContent_1',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      const formattedMockTooltip = `translate it: 123 %<br>${mockDate.toLocaleString(
        DATE_FORMAT.local,
        DATE_FORMAT.options
      )} ${mockDate.toLocaleTimeString(DATE_FORMAT.local)}`;

      expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
    });
  });

  describe('checkChanels', () => {
    it('should do sth with the cahnnels', () => {
      const mockGreaseDisplay = {
        waterContent_1: true,
        deterioration_1: true,
        temperatureOptics_1: true,
        waterContent_2: true,
        deterioration_2: true,
        temperatureOptics_2: true,
        rsmShaftSpeed: true,
      };

      component.displayForm.setValue(mockGreaseDisplay);

      component.checkChannels();

      component.dataSource.data[1].formControl.markAsDirty();
      component.dataSource.data[1].formControl.patchValue(false);

      expect(component.displayForm.value).toEqual({
        ...mockGreaseDisplay,
        rsmShaftSpeed: false,
      });
    });
  });
});
