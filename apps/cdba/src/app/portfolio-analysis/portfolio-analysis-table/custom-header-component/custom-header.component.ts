import { Component } from '@angular/core';

import { IHeaderParams } from '@ag-grid-community/all-modules';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { deselectReferenceType } from '@cdba/core/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  params!: IHeaderParams;
  isXButtonVisible: boolean;
  nodeId: string;

  refresh(_params: IHeaderParams) {
    return false;
  }

  agInit(params: IHeaderParams & { nodeId: string }): void {
    this.params = params;
    this.nodeId = params.nodeId;
  }

  constructor(private readonly store: Store) {
    this.isXButtonVisible = false;
  }

  onMouseOver(): void {
    this.isXButtonVisible = true;
  }

  onMouseLeave(): void {
    this.isXButtonVisible = false;
  }

  xButtonClicked(nodeId: string) {
    this.store.dispatch(deselectReferenceType({ nodeId }));
  }
}
