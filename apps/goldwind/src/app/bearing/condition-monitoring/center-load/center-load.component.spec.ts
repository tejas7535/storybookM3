import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxEchartsModule } from 'ngx-echarts';

import { DATE_FORMAT } from '../../../shared/constants';
import { CenterLoadComponent } from './center-load.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn((key) => key),
}));

describe('CenterLoadComponent', () => {
  let component: CenterLoadComponent;
  let spectator: Spectator<CenterLoadComponent>;

  const createComponent = createComponentFactory({
    component: CenterLoadComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      MatSliderModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          loadSense: {
            loading: false,
            result: undefined,
            interval: {
              startDate: 123456789,
              endDate: 987654321,
            },
          },
        },
      }),
    ],
    declarations: [CenterLoadComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should return a correctly formatted date string', () => {
      const mockDate = new Date(1466424490000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const mockCurrent = '2021-04-11T17:55:09Z';

      expect(component.formatDate(mockCurrent)).toBe(
        mockDate.toLocaleTimeString(DATE_FORMAT.local, DATE_FORMAT.options)
      );
    });
  });

  describe('tooltipFormatter', () => {
    it('should return a correctly formatted tooltip for rotor', () => {
      const params = {
        seriesName: `${translate(`conditionMonitoring.centerLoad.rotor`)}`,
        data: {
          value: [1000, 3000, 5000, 7000, 9000, 1100.11, 1300.13, 1500.15],
        },
      };

      const expectedTooltip = `${params.seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;1,000 N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;3,000 N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;5,000 N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;7,000 N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;9,000 N<br />
      Lsp 11:&nbsp;&nbsp;1,100 N<br />
      Lsp 13:&nbsp;&nbsp;1,300 N<br />
      Lsp 15:&nbsp;&nbsp;1,500 N<br />`;

      expect(component.tooltipFormatter(params)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for average rotor', () => {
      const params = {
        seriesName: `${translate(
          `conditionMonitoring.centerLoad.rotorAverage`
        )}`,
        data: {
          value: [1000, 3000, 5000, 7000, 9000, 1100.11, 1300.13, 1500.15],
        },
      };

      const expectedTooltip = `${params.seriesName}<br />
      Lsp 1:&nbsp;&nbsp;&nbsp;&nbsp;1,000 N<br />
      Lsp 3:&nbsp;&nbsp;&nbsp;&nbsp;3,000 N<br />
      Lsp 5:&nbsp;&nbsp;&nbsp;&nbsp;5,000 N<br />
      Lsp 7:&nbsp;&nbsp;&nbsp;&nbsp;7,000 N<br />
      Lsp 9:&nbsp;&nbsp;&nbsp;&nbsp;9,000 N<br />
      Lsp 11:&nbsp;&nbsp;1,100 N<br />
      Lsp 13:&nbsp;&nbsp;1,300 N<br />
      Lsp 15:&nbsp;&nbsp;1,500 N<br />`;

      expect(component.tooltipFormatter(params)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for generator', () => {
      const params = {
        seriesName: `${translate(`conditionMonitoring.centerLoad.generator`)}`,
        data: {
          value: [2000, 4000, 6000, 8000, 10000, 1200.12, 1400.14, 1600.16],
        },
      };

      const expectedTooltip = `${params.seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;2,000 N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;4,000 N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;6,000 N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;8,000 N<br />
      Lsp 10:&nbsp;&nbsp;10,000 N<br />
      Lsp 12:&nbsp;&nbsp;1,200 N<br />
      Lsp 14:&nbsp;&nbsp;1,400 N<br />
      Lsp 16:&nbsp;&nbsp;1,600 N<br />`;

      expect(component.tooltipFormatter(params)).toBe(expectedTooltip);
    });

    it('should return a correctly formatted tooltip for generator average', () => {
      const params = {
        seriesName: `${translate(
          `conditionMonitoring.centerLoad.generatorAverage`
        )}`,
        data: {
          value: [2000, 4000, 6000, 8000, 10000, 1200.12, 1400.14, 1600.16],
        },
      };

      const expectedTooltip = `${params.seriesName}<br />
      Lsp 2:&nbsp;&nbsp;&nbsp;&nbsp;2,000 N<br />
      Lsp 4:&nbsp;&nbsp;&nbsp;&nbsp;4,000 N<br />
      Lsp 6:&nbsp;&nbsp;&nbsp;&nbsp;6,000 N<br />
      Lsp 8:&nbsp;&nbsp;&nbsp;&nbsp;8,000 N<br />
      Lsp 10:&nbsp;&nbsp;10,000 N<br />
      Lsp 12:&nbsp;&nbsp;1,200 N<br />
      Lsp 14:&nbsp;&nbsp;1,400 N<br />
      Lsp 16:&nbsp;&nbsp;1,600 N<br />`;

      expect(component.tooltipFormatter(params)).toBe(expectedTooltip);
    });
  });
});
