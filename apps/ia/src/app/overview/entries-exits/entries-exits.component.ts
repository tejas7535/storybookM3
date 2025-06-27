import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { LegendSelectAction } from '../../shared/charts/models';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { EmployeeWithAction } from '../../shared/models';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class EntriesExitsComponent {
  private _dimensionHint: string;

  legendSelectAction: LegendSelectAction;
  legend: ChartLegendItem[] = [];

  @Input() isDataLoading: boolean;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() totalEmployeesCount: number;
  @Input() exitEmployees: EmployeeWithAction[];
  @Input() exitEmployeesLoading: boolean;
  @Input() entryEmployees: EmployeeWithAction[];
  @Input() entryEmployeesLoading: boolean;
  @Input() leaversListDialogMetaHeadings: EmployeeListDialogMetaHeadings;
  @Input() newJoinersListDialogMetaHeadings: EmployeeListDialogMetaHeadings;

  @Input() set dimensionHint(dimensionHint: string) {
    this._dimensionHint = dimensionHint;
  }

  get dimensionHint(): string {
    return this._dimensionHint;
  }

  @Output()
  readonly loadExitEmployees: EventEmitter<void> = new EventEmitter();
  @Output()
  readonly loadEntryEmployees: EventEmitter<void> = new EventEmitter();

  onSelectedLegendItem(action: LegendSelectAction): void {
    this.legendSelectAction = action;
  }

  triggerExitEmployeesAction(): void {
    this.loadExitEmployees.emit();
  }

  triggerEntryEmployeesAction(): void {
    this.loadEntryEmployees.emit();
  }
}
