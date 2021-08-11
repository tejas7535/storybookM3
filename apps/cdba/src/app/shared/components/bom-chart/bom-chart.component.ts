import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';

import { BomItem } from '../../models';
import {
  COLOR_PLATTE,
  getChartSeries,
  getXAxisConfig,
  TOOLTIP_CONFIG,
  Y_AXIS_CONFIG,
} from './bom-chart.config';
import { DataPoint } from './data-point.model';

@Component({
  selector: 'cdba-bom-chart',
  templateUrl: './bom-chart.component.html',
  styleUrls: ['./bom-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BomChartComponent implements OnChanges {
  public constructor(
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe
  ) {}

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input() public set data(data: BomItem[]) {
    this.barChartData = [];
    this.lineChartData = [];

    let accumulatedCosts = 0;
    let totalCosts = 0;
    this.hasNegativeCostValues = false;

    data.forEach((value: BomItem, index: number) => {
      this.barChartData.push(this.createDataPoint(value, index));
      totalCosts += value.totalPricePerPc;

      this.hasNegativeCostValues = this.hasNegativeCostValues
        ? true
        : value.totalPricePerPc < 0;
    });

    this.barChartData.forEach((datapoint: DataPoint) => {
      accumulatedCosts += datapoint.value;
      this.lineChartData.push((accumulatedCosts / totalCosts) * 100);
    });
  }

  public barChartData: DataPoint[];
  private lineChartData: number[];
  private hasNegativeCostValues = false;

  options: any;

  createDataPoint(bomItem: BomItem, index: number): DataPoint {
    return {
      name: this.scrambleMaterialDesignationPipe.transform(
        bomItem.materialDesignation
      ),
      value: bomItem.totalPricePerPc,
      itemStyle: { color: COLOR_PLATTE[index] },
    };
  }

  ngOnChanges(): void {
    this.options = {
      color: ['black', '#B00020'],
      tooltip: TOOLTIP_CONFIG,
      yAxis: Y_AXIS_CONFIG,
      xAxis: getXAxisConfig(this.hasNegativeCostValues),
      series: getChartSeries(this.barChartData, this.lineChartData),
    };
  }
}
