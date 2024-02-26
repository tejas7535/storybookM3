import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { ChartType } from '../models';

@Component({
  selector: 'ia-drill-down-tool-panel',
  templateUrl: './drill-down-tool-panel.component.html',
  styleUrls: ['./drill-down-tool-panel.component.scss'],
})
export class DrillDownToolPanelComponent {
  fluctuationTypeEnum = FluctuationType;
  fluctuationType: FluctuationType = FluctuationType.TOTAL;
  possibleChartTypes = ChartType;

  @Input() selectedChart: ChartType;

  @Output() readonly chartTypeChanged: EventEmitter<ChartType> =
    new EventEmitter();
  @Output() readonly fluctuationTypeChanged: EventEmitter<FluctuationType> =
    new EventEmitter();
  @Output() readonly exportBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly expandBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly collapseBtn: EventEmitter<void> = new EventEmitter();

  onChartTypeChange(event: MatButtonToggleChange): void {
    this.chartTypeChanged.emit(event.value);
  }

  onFluctuationTypeChange(event: MatButtonToggleChange) {
    this.fluctuationTypeChanged.emit(event.value);
  }

  onExportBtnClick(): void {
    this.exportBtn.emit();
  }

  onExpandBtnClick(): void {
    this.expandBtn.emit();
  }

  onCollapseBtnClick(): void {
    this.collapseBtn.emit();
  }
}
