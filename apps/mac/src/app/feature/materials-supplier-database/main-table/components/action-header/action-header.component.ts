import { ChangeDetectorRef, Component } from '@angular/core';
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
  public checkBoxStyle: string;

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public agInit(params: IHeaderParams): void {
    this.params = params;
    this.setCheckBoxStyle();
    this.params.api.addEventListener('selectionChanged', () => {
      this.setCheckBoxStyle();
    });
  }

  public refresh() {
    return false;
  }

  public onSelectClick(): void {
    if (this.isAllSelected()) {
      this.params.api.deselectAll();
    } else {
      this.params.api.selectAllFiltered();
    }
  }

  private setCheckBoxStyle() {
    if (this.isAllSelected()) {
      this.checkBoxStyle = 'check_box';
    } else if (this.isAnySelected()) {
      this.checkBoxStyle = 'indeterminate_check_box';
    } else {
      this.checkBoxStyle = 'check_box_outline_blank';
    }
    // this is required to update the icon instantly
    this.changeDetectorRef.detectChanges();
  }

  private isAnySelected() {
    return this.params.api.getSelectedNodes().length > 0;
  }

  private isAllSelected() {
    return (
      this.params.api.getRenderedNodes().length > 0 &&
      this.params.api.getRenderedNodes().length <=
        this.params.api.getSelectedNodes().length
    );
  }
}
