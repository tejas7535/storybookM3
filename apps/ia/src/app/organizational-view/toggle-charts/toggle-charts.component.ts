import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { ChartType } from '../models';

@Component({
  selector: 'ia-toggle-charts',
  templateUrl: './toggle-charts.component.html',
  styles: [
    `
      .mat-button-toggle-checked mat-icon {
        @apply text-link;
      }
    `,
  ],
})
export class ToggleChartsComponent {
  @Input() set chartType(chartType: ChartType) {
    this.selectedChart = chartType;
  }

  @Output() readonly changed: EventEmitter<ChartType> = new EventEmitter();

  selectedChart: ChartType;
  possibleChartTypes = ChartType;

  public valueChanged(event: MatButtonToggleChange): void {
    this.changed.emit(event.value);
  }
}
