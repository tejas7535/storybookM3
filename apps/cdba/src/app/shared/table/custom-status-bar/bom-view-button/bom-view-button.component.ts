import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/core';

@Component({
  selector: 'cdba-bom-view-button',
  templateUrl: './bom-view-button.component.html',
  styleUrls: ['./bom-view-button.component.scss'],
})
export class BomViewButtonComponent {
  agInit(_params: IStatusPanelParams): void {}
}
