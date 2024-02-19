import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { ChartType } from '../models';

@Component({
  selector: 'ia-toggle-charts',
  templateUrl: './toggle-charts.component.html',
  styleUrls: ['./toggle-charts.component.scss'],
})
export class ToggleChartsComponent {
  @Output() readonly changed: EventEmitter<ChartType> = new EventEmitter();

  selectedChart: ChartType;
  possibleChartTypes = ChartType;

  @Input() set chartType(chartType: ChartType) {
    this.selectedChart = chartType;
  }

  public valueChanged(event: MatButtonToggleChange): void {
    this.changed.emit(event.value);
  }
}
