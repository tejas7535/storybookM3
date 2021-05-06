import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { NgxEchartsModule } from 'ngx-echarts';

import { TerminatedEmployee } from '../../shared/models';
import { SharedModule } from '../../shared/shared.module';
import { OverviewChartLegendComponent } from './overview-chart-legend/overview-chart-legend.component';
import { OverviewChartComponent } from './overview-chart.component';
import {
  CHART_BASE_OPTIONS,
  SERIES_BASE_OPTIONS,
} from './overview-chart.config';
import { TerminatedEmployeesDialogComponent } from './terminated-employees-dialog/terminated-employees-dialog.component';
import { TerminatedEmployeesDialogModule } from './terminated-employees-dialog/terminated-employees-dialog.module';

describe('OverviewChartComponent', () => {
  let component: OverviewChartComponent;
  let spectator: Spectator<OverviewChartComponent>;

  const createComponent = createComponentFactory({
    component: OverviewChartComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      MatCheckboxModule,
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
      TranslocoTestingModule,
      MatDialogModule,
      TerminatedEmployeesDialogModule,
    ],
    declarations: [OverviewChartComponent, OverviewChartLegendComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    it('should set correct chart configuration', () => {
      const data: any = {
        2020: {
          employees: [],
          attrition: [10, 20, 10],
        },
      };

      const expectedChartOptions = {
        ...CHART_BASE_OPTIONS,
        series: [{ ...SERIES_BASE_OPTIONS, name: '2020', data: [10, 20, 10] }],
      };

      const exptectedChartSeries = [
        {
          name: '2020',
          checked: true,
        },
      ];

      component.data = data;

      expect(component.options).toEqual(expectedChartOptions);
      expect(component.chartSeries).toEqual(exptectedChartSeries);
    });
  });

  describe('toggleChartSeries', () => {
    beforeEach(() => {
      component['chartInstance'] = { dispatchAction: jest.fn() };

      const chartSeries = [
        { name: '2020', checked: true },
        { name: '2019', checked: true },
      ];

      component.chartSeries = chartSeries;
    });

    it('should switch checked value of series', () => {
      component.toggleChartSeries('2020');

      expect(component.chartSeries[0].checked).toBeFalsy();
    });

    it('should dispatch toggle action on chart instance', () => {
      component.toggleChartSeries('2020');

      expect(component['chartInstance'].dispatchAction).toHaveBeenCalledWith({
        name: '2020',
        type: 'legendToggleSelect',
      });
    });
  });

  describe('onChartInit', () => {
    it('should set chart instance', () => {
      const chartInstance = { foo: 'bar' };

      component.onChartInit(chartInstance);

      expect(component['chartInstance']).toEqual(chartInstance);
    });
  });

  describe('onChartClick', () => {
    const employee: TerminatedEmployee = {
      employeeName: 'Donald Trump',
      position: 'Depp',
      orgUnit: 'Zirkus',
    };

    const data: {
      [seriesName: string]: {
        employees: TerminatedEmployee[][];
        attrition: number[];
      };
    } = {
      2020: {
        employees: [[employee], [], []],
        attrition: [10, 20, 10],
      },
    };

    it('should open the dialog with correct data', () => {
      const event = { dataIndex: 0, seriesName: '2020', name: 'Jan' };

      component['dialog'].open = jest.fn();

      component.data = data;
      component.onChartClick(event);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        TerminatedEmployeesDialogComponent,
        {
          data: {
            title: '2020 - Jan:',
            employees: [employee],
          },
          width: '600px',
        }
      );
    });
  });
});
