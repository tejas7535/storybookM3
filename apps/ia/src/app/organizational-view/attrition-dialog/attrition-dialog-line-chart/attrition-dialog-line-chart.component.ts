import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';

@Component({
  selector: 'ia-attrition-dialog-line-chart',
  templateUrl: './attrition-dialog-line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttritionDialogLineChartComponent implements OnInit {
  currentYear: number;
  options: EChartsOption;

  ngOnInit(): void {
    const date = new Date();

    this.currentYear = date.getFullYear();
  }
}
