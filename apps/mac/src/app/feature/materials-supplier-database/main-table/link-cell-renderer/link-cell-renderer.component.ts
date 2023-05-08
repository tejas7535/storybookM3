import { Component } from '@angular/core';

import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';

@Component({
  selector: 'mac-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
})
export class LinkCellRendererComponent extends EditCellRendererComponent {
  public agInit(params: EditCellRendererParams): void {
    super.agInit(params);
  }

  public getHref() {
    return this.params.valueFormatted?.split('|')[1];
  }

  public getName() {
    return this.params.valueFormatted?.split('|')[0];
  }
}
