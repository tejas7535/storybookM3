import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PushPipe } from '@ngrx/component';

import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';

@Component({
  selector: 'mac-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // anuglar material
    MatIconModule,
    // ngrx
    PushPipe,
  ],
})
export class LinkCellRendererComponent extends EditCellRendererComponent {
  public getHref() {
    return this.params.valueFormatted?.split('|')[1];
  }

  public getName() {
    return this.params.valueFormatted?.split('|')[0];
  }
}
