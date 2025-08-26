import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ResultTypeConfig } from '@mm/core/store/models/calculation-result-state.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mm-report-selection',
  templateUrl: './report-selection.component.html',
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class ReportSelectionComponent {
  @Input() isPdfGenerating: boolean;
  @Input() selectionTypes: ResultTypeConfig[] = [];
  @Input() standalone = false;
  @Output() readonly calculationTypeClicked: EventEmitter<
    ResultTypeConfig['name']
  > = new EventEmitter();

  readonly downloadPdfClicked = output();

  onCalculationTypeClicked(configName: ResultTypeConfig['name']): void {
    this.calculationTypeClicked.emit(configName);
  }

  onDownloaPdfClicked(): void {
    this.downloadPdfClicked.emit();
  }
}
