import { ElementRef } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridApi, ICellRendererParams, IRowNode } from 'ag-grid-community';

export class AbstractReasonAnalysisRendererComponent<T>
  implements ICellRendererAngularComp
{
  readonly PADDING = 24;

  data: T | undefined;
  api: GridApi;
  node: IRowNode<T>;
  expanded = false;

  constructor(public elRef: ElementRef) {}

  setData(data: T): void {
    this.data = data;
  }

  toggleExpand(_id: number): void {
    if (this.data) {
      this.expanded = !this.expanded;
      this.redrawRows();
    }
  }

  agInit(params: ICellRendererParams<T>): void {
    if (params.data) {
      this.setData(params.data);
    }
    this.api = params.api;
    this.node = params.node;
    this.redrawRows();
  }

  refresh(): boolean {
    return false;
  }

  redrawRows() {
    setTimeout(() => {
      this.node.setRowHeight(
        this.elRef.nativeElement.offsetHeight + this.PADDING
      );
      this.api.onRowHeightChanged();
    }, 1);
  }
}
