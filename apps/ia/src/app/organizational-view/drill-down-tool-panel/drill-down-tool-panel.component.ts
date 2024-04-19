import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { ChartType, ZoomButton } from '../models';

@Component({
  selector: 'ia-drill-down-tool-panel',
  templateUrl: './drill-down-tool-panel.component.html',
  styleUrls: ['./drill-down-tool-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillDownToolPanelComponent {
  fluctuationTypeEnum = FluctuationType;
  fluctuationType: FluctuationType = FluctuationType.TOTAL;
  possibleChartTypes = ChartType;
  zoomButtonEnum = ZoomButton;

  @Input() selectedChart: ChartType;

  @Output() readonly chartTypeChanged: EventEmitter<ChartType> =
    new EventEmitter();
  @Output() readonly fluctuationTypeChanged: EventEmitter<FluctuationType> =
    new EventEmitter();
  @Output() readonly exportBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly expandBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly collapseBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly zoomInBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly zoomOutBtn: EventEmitter<void> = new EventEmitter();
  @Output() readonly zoomToFitBtn: EventEmitter<void> = new EventEmitter();

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

  onZoomChange(
    value: ZoomButton,
    event: MouseEvent,
    group: MatButtonToggleGroup
  ): void {
    event.preventDefault();
    if (value === this.zoomButtonEnum.ZOOM_IN) {
      this.zoomInBtn.emit();
    } else if (value === this.zoomButtonEnum.ZOOM_OUT) {
      this.zoomOutBtn.emit();
    } else {
      this.zoomToFitBtn.emit();
    }
    group.value = [
      this.zoomButtonEnum.ZOOM_IN,
      this.zoomButtonEnum.ZOOM_OUT,
      this.zoomButtonEnum.ZOOM_TO_FIT,
    ];
  }
}
