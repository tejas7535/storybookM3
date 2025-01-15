import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

import { deselectReferenceType } from '@cdba/core/store';

@Component({
  selector: 'cdba-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  @Input() params!: IHeaderParams;
  isXButtonVisible: boolean;
  nodeId: string;

  constructor(private readonly store: Store) {
    this.isXButtonVisible = false;
  }

  refresh(_params: IHeaderParams) {
    return false;
  }

  agInit(params: IHeaderParams & { nodeId: string }): void {
    this.params = params;
    this.nodeId = params.nodeId;
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
