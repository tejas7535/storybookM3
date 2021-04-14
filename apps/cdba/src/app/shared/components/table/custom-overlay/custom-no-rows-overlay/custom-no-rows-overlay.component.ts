import { Component } from '@angular/core';

import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';

export interface NoRowsParams {
  getMessage: Function;
}

@Component({
  selector: 'cdba-custom-no-rows-overlay',
  templateUrl: './custom-no-rows-overlay.component.html',
  styleUrls: ['./custom-no-rows-overlay.component.scss'],
})
export class CustomNoRowsOverlayComponent implements INoRowsOverlayAngularComp {
  params: NoRowsParams;

  agInit(params: NoRowsParams): void {
    this.params = params;
  }
}
