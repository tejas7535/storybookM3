import { Component } from '@angular/core';

import { INoRowsOverlayAngularComp } from '@ag-grid-community/angular';
import { INoRowsOverlayParams } from '@ag-grid-community/core';

export interface NoRowsParams {
  getMessage: () => string;
}

@Component({
  selector: 'cdba-custom-no-rows-overlay',
  templateUrl: './custom-no-rows-overlay.component.html',
  styleUrls: ['./custom-no-rows-overlay.component.scss'],
})
export class CustomNoRowsOverlayComponent implements INoRowsOverlayAngularComp {
  params: NoRowsParams;

  agInit(params: INoRowsOverlayParams & NoRowsParams): void {
    this.params = params;
  }
}
