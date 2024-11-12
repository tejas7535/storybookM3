import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'd360-row-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './row-menu.component.html',
  styleUrls: ['./row-menu.component.css'],
})
export class RowMenuComponent<PARAM_INTERFACE>
  implements ICellRendererAngularComp
{
  anchroEl!: HTMLButtonElement;
  @Input({ required: true }) open!: boolean;
  @Output() openChange = new EventEmitter<boolean>();
  protected params: ICellRendererParams;
  protected data: PARAM_INTERFACE;

  handleOpen(event: MouseEvent) {
    this.anchroEl = event.currentTarget as HTMLButtonElement;
    this.openChange.emit(true);
  }

  handleClose() {
    this.anchroEl = null;
    this.openChange.emit(false);
  }

  agInit(params: ICellRendererParams<PARAM_INTERFACE>): void {
    this.data = params.data as PARAM_INTERFACE;
    this.params = params;
  }

  refresh(_: ICellRendererParams): boolean {
    return false;
  }

  protected updateData(data: PARAM_INTERFACE) {
    this.data = data;
    this.params.data = data;
    this.params.api.getRowNode(this.params.node.id).updateData(data);
  }
}
