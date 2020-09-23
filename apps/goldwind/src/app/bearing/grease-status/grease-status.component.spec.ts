import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { GraphData } from '../../core/store/reducers/shared/models';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { GreaseStatusComponent } from './grease-status.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('GreaseStatusComponent', () => {
  let component: GreaseStatusComponent;
  let fixture: ComponentFixture<GreaseStatusComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        DateRangeModule,
        MatCardModule,
        MatCheckboxModule,
        provideTranslocoTestingModule({}),
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
        ReactiveComponentModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            greaseStatus: {
              loading: false,
              result: undefined,
              display: {
                waterContentPercent: true,
                deteriorationPercent: true,
                temperatureCelsius: true,
                rotationalSpeed: true,
              },
              interval: {
                startDate: 123456789,
                endDate: 987654321,
              },
            },
          },
        }),
      ],
      declarations: [GreaseStatusComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });

  describe('Display Form', () => {
    test('should dispatch setGreaseAction on valueChanges', () => {
      const mockGreaseDisplay = {
        waterContentPercent: true,
        deteriorationPercent: true,
        temperatureCelsius: true,
        rotationalSpeed: false,
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
    test('should dispatch the setEdmInterval action', () => {
      mockStore.dispatch = jest.fn();

      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };

      component.setInterval(mockInterval);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setGreaseInterval({ interval: mockInterval })
      );
    });
  });

  describe('chartOptions', () => {
    it('should call legend formatter method', () => {
      const mockLabelName = 'waterContentPercent';
      component.formatLegend = jest.fn();

      const legendFormatter = component.chartOptions.legend
        .formatter as Function;
      legendFormatter(mockLabelName);

      expect(component.formatLegend).toHaveBeenCalledTimes(1);
    });

    it('should call tooltip formatter method', () => {
      const mockParams = [
        {
          seriesName: 'waterContentPercent',
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
  });

  describe('formatLegend', () => {
    it('should return a translated text with physical symbol ', () => {
      const mockLabelName = 'waterContentPercent';
      const formattedMockLabel = 'translate it (%)';

      expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);
    });
  });

  describe('formatTooltip', () => {
    it('should return a translated texts with physical symbols and date', () => {
      const mockDate = new Date(1466424490000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      const mockParams = [
        {
          seriesName: 'waterContentPercent',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      const formattedMockTooltip = `translate it: 123 %<br>${mockDate.toLocaleString()}`;

      expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
    });
  });

  describe('emptyGreaseStatusGraphData', () => {
    it('should return true if none of the grease status graph datas contain data', () => {
      const mockGreaseStatusGraphData: GraphData = {
        legend: {
          data: ['deteriorationPercent', 'temperatureCelsius'],
        },
        series: [
          {
            name: 'deteriorationPercent',
            type: 'line',
            data: [],
          },
          {
            name: 'temperatureCelsius',
            type: 'line',
            data: [],
          },
        ],
      };

      expect(
        component.emptyGreaseStatusGraphData(mockGreaseStatusGraphData)
      ).toBe(true);
    });
  });
});
