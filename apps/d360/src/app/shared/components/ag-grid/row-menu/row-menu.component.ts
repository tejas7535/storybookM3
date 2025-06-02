import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'd360-row-menu',
  imports: [MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './row-menu.component.html',
  styleUrls: ['./row-menu.component.scss'],
})
export class RowMenuComponent<PARAM_INTERFACE>
  implements ICellRendererAngularComp
{
  public open: InputSignal<boolean> = input.required<boolean>();
  public openChange: OutputEmitterRef<boolean> = output<boolean>();

  protected params: ICellRendererParams;
  protected data: PARAM_INTERFACE;

  protected handleOpen(): void {
    this.openChange.emit(true);
  }

  protected handleClose(): void {
    this.openChange.emit(false);
  }

  public agInit(params: ICellRendererParams<PARAM_INTERFACE>): void {
    this.data = params.data as PARAM_INTERFACE;
    this.params = params;
  }

  public refresh(_: ICellRendererParams): boolean {
    return false;
  }

  protected updateData(data: PARAM_INTERFACE) {
    this.data = data;
    this.params.data = data;
    this.params.api.getRowNode(this.params.node.id).updateData(data);
  }
}
