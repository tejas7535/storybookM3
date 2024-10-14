import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { ResultTypeConfig } from '@mm/core/store/models/calculation-result-state.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mm-report-selection',
  templateUrl: './report-selection.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
})
export class ReportSelectionComponent {
  @Input() selectionTypes: ResultTypeConfig[] = [];
  @Output() readonly calculationTypeClicked: EventEmitter<
    ResultTypeConfig['name']
  > = new EventEmitter();

  onCalculationTypeClicked(configName: ResultTypeConfig['name']): void {
    this.calculationTypeClicked.emit(configName);
  }
}
