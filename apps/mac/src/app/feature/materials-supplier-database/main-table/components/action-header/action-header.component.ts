import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PushPipe } from '@ngrx/component';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

import { DataFacade } from '../../../store/facades/data';

@Component({
  selector: 'mac-action-header',
  templateUrl: './action-header.component.html',
  standalone: true,
  imports: [
    // angular material
    MatIconModule,
    // ngrx
    PushPipe,
  ],
})
export class ActionHeaderComponent implements IHeaderAngularComp {
  public params!: IHeaderParams;

  public isBulkEditAllowed$ = this.dataFacade.isBulkEditAllowed$;

  constructor(private readonly dataFacade: DataFacade) {}

  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  refresh() {
    return false;
  }

  public getCheckBoxStyle() {
    if (this.isAllSelected()) {
      return 'check_box';
    } else if (this.isAnySelected()) {
      return 'indeterminate_check_box';
    } else {
      return 'check_box_outline_blank';
    }
  }

  public onSelectClick(): void {
    if (this.isAllSelected()) {
      this.params.api.deselectAllFiltered();
    } else {
      this.params?.api.selectAllFiltered();
    }
  }

  private isAnySelected() {
    return this.params?.api.getSelectedNodes().length > 0;
  }

  private isAllSelected() {
    return !this.params?.api
      .getRenderedNodes()
      .find((node) => !node.isSelected());
  }
}
