import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { DATE_FORMAT } from '../../shared/constants';
import { DateRangeModule } from '../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../shared/empty-graph/empty-graph.module';
import { GreaseStatusComponent } from './grease-status.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('GreaseStatusComponent', () => {
  let component: GreaseStatusComponent;
  let spectator: Spectator<GreaseStatusComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: GreaseStatusComponent,
    imports: [
      ReactiveFormsModule,
      DateRangeModule,
      EmptyGraphModule,
      MatCardModule,
      MatCheckboxModule,
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
              waterContent: true,
              deterioration: true,
              temperatureOptics: true,
              rsmShaftSpeed: true,
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

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
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
        waterContent: true,
        deterioration: true,
        temperatureOptics: true,
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
      const mockLabelName = 'waterContent';
      component.formatLegend = jest.fn();

      const legendFormatter = (component.chartOptions.legend as any)
        .formatter as Function;
      legendFormatter(mockLabelName);

      expect(component.formatLegend).toHaveBeenCalledTimes(1);
    });

    it('should call tooltip formatter method', () => {
      const mockParams = [
        {
          seriesName: 'waterContent',
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
    it('should return a translated text with physical symbol ', () => {
      const mockLabelName = 'waterContent';
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
          seriesName: 'waterContent',
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
});
