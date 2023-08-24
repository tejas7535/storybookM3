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
  @Input() public materialDesignation: string;
  @Input() public selectedBomItem: BomItem;
  @Input() public selectedCalculation: Calculation;

  public barChartData: DataPoint[];
  options: any;

  private lineChartData: number[];
  private hasNegativeCostValues = false;

  public constructor(
    protected bomChartConfigService: BomChartConfigService,
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe,
    private readonly costShareService: CostShareService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input() public set data(data: BomItem[]) {
    this.barChartData = [];
    this.lineChartData = [];

    let accumulatedCosts = 0;
    let totalCosts = 0;
    this.hasNegativeCostValues = false;

    data?.forEach((value) => {
      const totalValue = Object.prototype.hasOwnProperty.call(
        value,
        'totalPricePerPc'
      )
        ? value.costing.costAreaTotalPrice
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

  createDataPoint(bomItem: BomItem): DataPoint {
    return {
      name: this.scrambleMaterialDesignationPipe.transform(
        bomItem.materialDesignation
      ),
      // eslint-disable-next-line no-prototype-builtins
      value: bomItem.hasOwnProperty('costAreaTotalPrice')
        ? bomItem.costing.costAreaTotalPrice
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
