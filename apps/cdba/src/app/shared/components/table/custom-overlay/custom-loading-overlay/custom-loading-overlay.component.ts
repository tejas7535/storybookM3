import { Component } from '@angular/core';

import { ILoadingOverlayAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'cdba-custom-loading-overlay',
  templateUrl: './custom-loading-overlay.component.html',
})
export class CustomLoadingOverlayComponent
  implements ILoadingOverlayAngularComp
{
  agInit(): void {
    // no params needed for now
    // this can be used to set e.g. custom text in template
  }
}
