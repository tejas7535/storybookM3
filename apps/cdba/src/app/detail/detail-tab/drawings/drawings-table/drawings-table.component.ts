import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { RowSelectedEvent } from 'ag-grid-community';
import { ColDef } from 'ag-grid-enterprise';

import { Drawing } from '@cdba/shared/models';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { ColumnDefinitionService, DEFAULT_COLUMN_DEFINITION } from './config';

@Component({
  selector: 'cdba-drawings-table',
  templateUrl: './drawings-table.component.html',
  styleUrls: ['./drawings-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingsTableComponent {
  @Input() rowData: Drawing[];
  @Input() selectedNodeId: string;

  @Output() readonly selectionChange: EventEmitter<{
    nodeId: string;
    drawing: Drawing;
  }> = new EventEmitter();

  public constructor(
    private readonly columnDefinitionService: ColumnDefinitionService
  ) {}

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;

  public columnDefs: ColDef[] = this.columnDefinitionService.COLUMN_DEFINITIONS;

  public components = {
    actionsCellRenderer: ActionsCellRendererComponent,
  };

  public onRowSelected({ node, api }: RowSelectedEvent): void {
    const nodeId = node.id;
    const drawing = api.getSelectedRows()[0];

    this.selectionChange.emit({ nodeId, drawing });
  }
}
