import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { ECharts, EChartsOption, SeriesOption } from 'echarts';

import { Color } from '../../models';
import { ExternalLegend } from '../external-legend';
import { LegendSelectAction } from '../models';
import { DoughnutChartData } from '../models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
} from './solid-doughnut-chart.config';

@Component({
  selector: 'ia-solid-doughnut-chart',
  templateUrl: './solid-doughnut-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolidDoughnutChartComponent extends ExternalLegend {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  _data: DoughnutChartData[];
  _initialConfig: SolidDoughnutChartConfig;
  selected: string;
  loadingOpts = {
    text: '',
    color: Color.GREEN,
    zlevel: 0,
  };

  @Input() isLoading: boolean;
  @Input() children: { reason: string; children: DoughnutChartData[] }[];

  readonly OPACITY_INACTIVE = 0.3;
  readonly OPACITY_ACTIVE = 1;

  @Input() set initialConfig(config: SolidDoughnutChartConfig) {
    this._initialConfig = config;
    const baseOptions: EChartsOption =
      createSolidDoughnutChartBaseOptions(config);

    const series: SeriesOption[] = createSolidDoughnutChartSeries(
      config.side,
      config.subTitle
    );
    this.options = {
      ...baseOptions,
      series,
    };
    this.mergeOptions = undefined;

    this.setCurrentData();
  }

  @Input() set data(data: DoughnutChartData[]) {
    this.selected = undefined;
    this._data = data;
    if (data) {
      this.setData(data);
    }
  }

  get data(): DoughnutChartData[] {
    return this._data;
  }

  @Input() set legendSelectAction(action: LegendSelectAction) {
    if (action) {
      this.echartsInstance?.setOption({
        legend: {
          selected: action,
        },
      });
    }
  }

  @Output() selectedReason: EventEmitter<string> = new EventEmitter<string>();

  onChartInit(ec: ECharts): void {
    super.onChartInit(ec);
    this.echartsInstance.on('click', (event: any) => {
      this.manageOnClickEvent(event);
    });
    if (this.isLoading) {
      this.echartsInstance.showLoading(this.loadingOpts);
    } else {
      this.echartsInstance.hideLoading();
    }
  }

  manageSelectedDataPoint(name: string): void {
    this.setSelectedReasons(name);
    this.removeChildrenOnToggle(name);
    this.echartsInstance.setOption(this.mergeOptions);
    this.selected = this.selected === name ? undefined : name;
  }

  removeChildrenOnToggle(name: string): void {
    if (this.selected === name) {
      (this.options.series as SeriesOption[])[1].data = [
        { value: 0, name: '', itemStyle: { color: 'transparent' } },
      ];
    }
  }

  setSelectedReasons(name: string): void {
    this.data.forEach((dataPoint) => {
      dataPoint.itemStyle =
        dataPoint.name === name || name === this.selected
          ? {
              opacity: this.OPACITY_ACTIVE,
            }
          : {
              opacity: this.OPACITY_INACTIVE,
            };
    });
  }

  setData(data: DoughnutChartData[]): void {
    const series = this.options.series as SeriesOption[];
    series[0].data = data;
    this.mergeOptions = {
      ...this.mergeOptions,
      series,
    };
  }

  setCurrentData(): void {
    if (this._data) {
      this.setData(this._data);
    }
  }

  manageOnClickEvent(event: any): void {
    // check if the clicked item is a reason
    if (
      !event.data?.name ||
      !this.data.map((d) => d.name).includes(event.data.name)
    ) {
      return;
    }
    this.selectedReason.emit(event.data.name);

    // get the detailed reasons for the clicked reason
    const children = this.children.find(
      (child) => child.reason === event.data.name
    )?.children;

    // set the detailed reasons
    (this.mergeOptions.series as SeriesOption[])[1].data = children;

    if (this.selected === event.data.name) {
      this.mergeOptions.legend = {
        data: undefined,
      };
      this.selectedReason.emit(undefined as string);
    } else {
      this.mergeOptions = {
        ...this.mergeOptions,
        legend: {
          data: [
            {
              name: event.data.name,
              textStyle: {
                fontWeight: 'bold',
              },
            },
            ...children.map((c) => c.name),
          ],
        },
      };
    }

    this.echartsInstance.setOption(this.mergeOptions);

    this.manageSelectedDataPoint(event.data.name);
  }

  resetChart(): void {
    this.manageOnClickEvent({ data: { name: this.selected } });
    this.selectedReason.emit(undefined as string);

    const dataSize = (
      (this.mergeOptions.series as SeriesOption[])[0]
        .data as DoughnutChartData[]
    ).length;

    for (let i = 0; i < dataSize; i += 1) {
      this.echartsInstance.dispatchAction({
        type: 'unselect',
        seriesIndex: 0,
        dataIndex: i,
      });
    }
  }
}
