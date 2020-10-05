import { Component } from '@angular/core';

import { ILoadingOverlayParams } from '@ag-grid-community/all-modules';
import { ILoadingOverlayAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'cdba-custom-loading-overlay',
  templateUrl: './custom-loading-overlay.component.html',
})
export class CustomLoadingOverlayComponent
  implements ILoadingOverlayAngularComp {
  agInit(_params: ILoadingOverlayParams): void {
    // no params needed for now
    // this can be used to set e.g. custom text in template
  }
}
