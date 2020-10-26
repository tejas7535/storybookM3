import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  COLUMN_DEFS,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  MODULES,
  STATUS_BAR_CONFIG,
} from './config';

@Component({
  selector: 'gq-input-table',
  templateUrl: './input-table.component.html',
  styleUrls: ['./input-table.component.scss'],
})
export class InputTableComponent {
  public modules = MODULES;
  public defaultColumnDefs = DEFAULT_COLUMN_DEFS;
  public columnDefs = COLUMN_DEFS;
  public statusBar = STATUS_BAR_CONFIG;
  public frameworkComponents = FRAMEWORK_COMPONENTS;

  @Input() rowData: any[];
  @Output() readonly cellChanged: EventEmitter<boolean> = new EventEmitter();

  onCellValueChanged(): void {
    this.cellChanged.emit();
  }
}
