import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  ColDef,
  RowSelectedEvent,
  RowSelectionOptions,
} from 'ag-grid-enterprise';

import { Drawing } from '@cdba/shared/models';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import {
  ColumnDefinitionService,
  DEFAULT_COLUMN_DEFINITION,
  DEFAULT_ROW_SELECTION,
} from './config';

@Component({
  selector: 'cdba-drawings-table',
  templateUrl: './drawings-table.component.html',
  styleUrls: ['./drawings-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DrawingsTableComponent {
  @Input() rowData: Drawing[];
  @Input() selectedNodeId: string;

  @Output() readonly selectionChange: EventEmitter<{
    nodeId: string;
    drawing: Drawing;
  }> = new EventEmitter();

  defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  rowSelection: RowSelectionOptions = DEFAULT_ROW_SELECTION;

  columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  components = {
    actionsCellRenderer: ActionsCellRendererComponent,
  };

  constructor(
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  onRowSelected({ node, api }: RowSelectedEvent): void {
    const nodeId = node.id;
    const drawing = api.getSelectedRows()[0];

    this.selectionChange.emit({ nodeId, drawing });
  }
}
