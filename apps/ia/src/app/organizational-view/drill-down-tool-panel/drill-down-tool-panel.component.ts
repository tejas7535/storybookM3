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

import { NavItem } from '../../shared/nav-buttons/models';
import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { ChartType, ZoomButton } from '../models';

@Component({
  selector: 'ia-drill-down-tool-panel',
  templateUrl: './drill-down-tool-panel.component.html',
  styleUrls: ['./drill-down-tool-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DrillDownToolPanelComponent {
  fluctuationType: FluctuationType = FluctuationType.TOTAL;
  translationPath = 'organizationalView.orgChart.type';
  possibleChartTypes = ChartType;
  zoomButtonEnum = ZoomButton;
  navButtons: NavItem[] = [
    {
      label: FluctuationType.TOTAL,
      translation: `${this.translationPath}.total`,
    },
    {
      label: FluctuationType.UNFORCED,
      translation: `${this.translationPath}.unforced`,
    },
    {
      label: FluctuationType.FORCED,
      translation: `${this.translationPath}.forced`,
    },
    {
      label: FluctuationType.REMAINING,
      translation: `${this.translationPath}.remaining`,
    },
  ];

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

  onFluctuationTypeChange(tab: string): void {
    const fluctuationType = Object.values(FluctuationType).find(
      (key) => FluctuationType[key] === tab
    );
    this.fluctuationTypeChanged.emit(fluctuationType);
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
