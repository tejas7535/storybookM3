import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DISPLAY } from '../../../testing/mocks';
import {
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../core/store/actions/load-assessment/load-assessment.actions';
import { BearingMetadata } from '../../core/store/reducers/bearing/models';
import { DATE_FORMAT } from '../../shared/constants';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { CenterLoadModule } from '../condition-monitoring/center-load/center-load.module';
import { LoadAssessmentComponent } from './load-assessment.component';

describe('LoadAssessmentComponent', () => {
  let component: LoadAssessmentComponent;
  let spectator: Spectator<LoadAssessmentComponent>;
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
    component: LoadAssessmentComponent,
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
        echarts: async () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          greaseStatus: {
            loading: false,
            result: undefined,
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
          loadAssessment: {
            display: DISPLAY,
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
        },
      }),
    ],
    declarations: [LoadAssessmentComponent],
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
    it('should dispatch setLoadAssessmentDisplay on valueChanges', () => {
      mockStore.dispatch = jest.fn();

      component.displayForm.markAsDirty();
      component.displayForm.patchValue({ rotationalSpeed: false });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentDisplay({ loadAssessmentDisplay: DISPLAY })
      );
    });
  });

  describe('setLoadAssessmentInterval', () => {
    it('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setLoadAssessmentInterval({ interval: mockInterval })
      );
    });
  });

  describe('chartOptions', () => {
    it('should call legend formatter method', () => {
      const mockLabelName = 'waterContent_1';
      component.formatLegend = jest.fn();

      const legendFormatter = (component.chartOptions.legend as any).formatter;
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
        .formatter;
      tooltipFormatter(mockParams);

      expect(component.formatTooltip).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatLegend', () => {
    it('should return a translated text with physical symbol', () => {
      const mockLabelName = 'waterContent_1';
      const formattedMockLabel = 'greaseStatus.waterContent_1 (%)';

      expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);
    });
  });

  describe('checkChannels', () => {
    it('should do sth with the channels', () => {
      component.displayForm.setValue(DISPLAY);

      component.checkChannels();

      component.dataSource.data[1].formControl.markAsDirty();
      component.dataSource.data[1].formControl.patchValue(false);

      expect(component.displayForm.value).toEqual({
        waterContent_1: true,
        deterioration_1: true,
        temperatureOptics_1: true,
        waterContent_2: true,
        deterioration_2: true,
        temperatureOptics_2: true,
        rsmShaftSpeed: true,
        // centerLoad: false,
        lsp01Strain: false,
        lsp02Strain: false,
        lsp03Strain: false,
        lsp04Strain: false,
        lsp05Strain: false,
        lsp06Strain: false,
        lsp07Strain: false,
        lsp08Strain: false,
        lsp09Strain: false,
        lsp10Strain: false,
        lsp11Strain: false,
        lsp12Strain: false,
        lsp13Strain: false,
        lsp14Strain: false,
        lsp15Strain: false,
        lsp16Strain: false,
      });
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
      const formattedMockTooltip = `greaseStatus.waterContent_1: 123 %<br>${mockDate.toLocaleString(
        DATE_FORMAT.local,
        DATE_FORMAT.options
      )} ${mockDate.toLocaleTimeString(DATE_FORMAT.local)}`;

      expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
      jest.resetAllMocks();
    });
  });
});
