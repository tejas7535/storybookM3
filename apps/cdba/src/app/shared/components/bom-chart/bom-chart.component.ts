import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

import { BomChartConfigService } from '@cdba/shared/components/bom-chart/bom-chart-config.service';
import { COST_SHARE_CATEGORY_COLORS } from '@cdba/shared/constants/colors';
import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';
import { CostShareService } from '@cdba/shared/services';

import { BomItem, Calculation } from '../../models';
import { TOOLTIP_CONFIG, Y_AXIS_CONFIG } from './bom-chart.constants';
import { DataPoint } from './data-point.model';

@Component({
  selector: 'cdba-bom-chart',
  templateUrl: './bom-chart.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [BomChartConfigService],
})
export class BomChartComponent implements OnChanges {
  public constructor(
    protected bomChartConfigService: BomChartConfigService,
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe,
    private readonly costShareService: CostShareService
  ) {}

  @Input() public materialDesignation: string;
  @Input() public selectedBomItem: BomItem;
  @Input() public selectedCalculation: Calculation;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input() public set data(data: BomItem[]) {
    this.barChartData = [];
    this.lineChartData = [];

    let accumulatedCosts = 0;
    let totalCosts = 0;
    this.hasNegativeCostValues = false;

    data.forEach((value) => {
      const totalValue = value.hasOwnProperty('totalPricePerPc')
        ? value.totalPricePerPc
        : value.costing.costAreaTotalValue;

      this.barChartData.push(this.createDataPoint(value));
      totalCosts += totalValue;

      this.hasNegativeCostValues = this.hasNegativeCostValues
        ? true
        : totalValue < 0;
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

  createDataPoint(bomItem: BomItem): DataPoint {
    return {
      name: this.scrambleMaterialDesignationPipe.transform(
        bomItem.materialDesignation
      ),
      // eslint-disable-next-line no-prototype-builtins
      value: bomItem.hasOwnProperty('totalPricePerPc')
        ? bomItem.totalPricePerPc
        : bomItem.costing.costAreaTotalValue,
      itemStyle: {
        color: COST_SHARE_CATEGORY_COLORS.get(
          this.costShareService.getCostShareCategory(bomItem.costShareOfParent)
        ),
      },
    };
  }

  ngOnChanges(): void {
    this.options = {
      color: ['black', '#B00020'],
      tooltip: TOOLTIP_CONFIG,
      yAxis: Y_AXIS_CONFIG,
      xAxis: this.bomChartConfigService.getXAxisConfig(
        this.hasNegativeCostValues
      ),
      series: this.bomChartConfigService.getChartSeries(
        this.barChartData,
        this.lineChartData
      ),
    };
  }
}
