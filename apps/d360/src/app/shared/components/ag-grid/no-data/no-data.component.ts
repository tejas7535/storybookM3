import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-enterprise';

import { DataHintComponent } from '../../data-hint/data-hint.component';

@Component({
  selector: 'd360-no-data-overlay',
  template: ` <d360-data-hint [text]="text"></d360-data-hint>`,
  imports: [DataHintComponent],
})
export class NoDataOverlayComponent implements INoRowsOverlayAngularComp {
  protected text: string;

  agInit(params: INoRowsOverlayParams & { message: string }): void {
    this.text = params.message || translate('hint.noData');
  }
}
