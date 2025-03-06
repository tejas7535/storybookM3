import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';

@Component({
  selector: 'mac-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
  imports: [
    // default
    CommonModule,
    // anuglar material
    MatIconModule,
  ],
})
export class LinkCellRendererComponent extends EditCellRendererComponent {
  public href: string;
  public name: string;

  public agInit(params: EditCellRendererParams): void {
    super.agInit(params);

    this.name = this.params.valueFormatted?.split('|')[0];
    this.href = this.params.valueFormatted?.split('|')[1];
  }
}
