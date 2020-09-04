import { Component, Input, OnChanges } from '@angular/core';

import { BomItem } from '../../../../core/store/reducers/detail/models';
import {
  COLOR_PLATTE,
  getChartSeries,
  TOOLTIP_CONFIG,
  X_AXIS_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.config';
import { DataPoint } from './data-point.model';

@Component({
  selector: 'cdba-bom-chart',
  templateUrl: './bom-chart.component.html',
})
export class BomChartComponent implements OnChanges {
  @Input('data') set chartData(data: BomItem[]) {
    this.barChartData = [];
    this.lineChartData = [];

    let accumulatedCosts = 0;
    let totalCosts = 0;
    data.forEach((value: BomItem, index: number) => {
      this.barChartData.push(BomChartComponent.createDataPoint(value, index));
      totalCosts += value.totalPricePerPc;
    });

    this.barChartData.forEach((datapoint: DataPoint) => {
      accumulatedCosts += datapoint.value;
      this.lineChartData.push((accumulatedCosts / totalCosts) * 100);
    });
  }

  private barChartData: DataPoint[];
  private lineChartData: number[];

  options: any;

  private static createDataPoint(bomItem: BomItem, index: number): DataPoint {
    return {
      name: bomItem.materialDesignation,
      value: bomItem.totalPricePerPc,
      itemStyle: { color: COLOR_PLATTE[index] },
    };
  }

  ngOnChanges(): void {
    this.options = {
      color: ['black', '#B00020'],
      tooltip: TOOLTIP_CONFIG,
      yAxis: Y_AXIS_CONFIG,
      xAxis: X_AXIS_CONFIG,
      series: getChartSeries(this.barChartData, this.lineChartData),
    };
  }
}
